import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../backend/supabaseAdminClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'token is required' }, { status: 400 });
    }

    const { data: vehicle, error } = await supabaseAdmin
      .from('fleet_vehicles')
      .select('id, owner_profile_id, vehicle_number, label, make_model')
      .eq('checkin_token', token)
      .single();

    if (error || !vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const { data: drivers } = await supabaseAdmin
      .from('fleet_drivers')
      .select('id, name')
      .eq('owner_profile_id', vehicle.owner_profile_id)
      .order('name');

    return NextResponse.json({
      vehicle: {
        id: vehicle.id,
        vehicle_number: vehicle.vehicle_number,
        label: vehicle.label,
        make_model: vehicle.make_model,
      },
      drivers: drivers || [],
    });
  } catch (err) {
    console.error('vehicle-checkin GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Public endpoint: possession of a valid checkin_token (from QR) authorizes check-in/out.
    const formData = await request.formData();
    const token = formData.get('token') as string;
    const checkType = formData.get('check_type') as string;
    const driverId = formData.get('driver_id') as string | null;
    const odometer = formData.get('odometer') as string | null;
    const fuelLevel = formData.get('fuel_level') as string | null;
    const conditionNotes = formData.get('condition_notes') as string | null;
    const tripPurpose = formData.get('trip_purpose') as string | null;
    const tripNote = formData.get('trip_note') as string | null;

    if (!token || !checkType) {
      return NextResponse.json({ error: 'token and check_type are required' }, { status: 400 });
    }

    const { data: vehicle, error: vErr } = await supabaseAdmin
      .from('fleet_vehicles')
      .select('id, owner_profile_id')
      .eq('checkin_token', token)
      .single();

    if (vErr || !vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const photos = formData.getAll('photos') as File[];
    const uploadedPaths: string[] = [];

    for (const photo of photos) {
      if (!(photo instanceof File) || photo.size === 0) continue;
      const ext = photo.name.split('.').pop() || 'jpg';
      const path = `${vehicle.owner_profile_id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await photo.arrayBuffer());

      const { error: uploadErr } = await supabaseAdmin.storage
        .from('fleet-photos')
        .upload(path, buffer, { contentType: photo.type });

      if (!uploadErr) uploadedPaths.push(path);
    }

    const { data: checkin, error: insertErr } = await supabaseAdmin
      .from('fleet_checkins')
      .insert({
        owner_profile_id: vehicle.owner_profile_id,
        vehicle_id: vehicle.id,
        driver_id: driverId || null,
        check_type: checkType,
        odometer_reading: odometer ? parseFloat(odometer) : null,
        fuel_level: fuelLevel || null,
        condition_notes: conditionNotes?.trim() || null,
        trip_purpose: tripPurpose || null,
        trip_note: tripPurpose === 'Other' ? (tripNote?.trim() || null) : null,
        photo_paths: uploadedPaths,
      })
      .select('id')
      .single();

    if (insertErr) {
      console.error('Checkin insert error:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    await supabaseAdmin.from('fleet_activity_logs').insert({
      owner_profile_id: vehicle.owner_profile_id,
      action: checkType,
      entity_type: 'checkin',
      entity_id: checkin.id,
      description: `${checkType === 'check_in' ? 'Checked in' : 'Checked out'} via QR scan`,
      metadata: {
        vehicle_id: vehicle.id,
        photos_count: uploadedPaths.length,
        trip_purpose: tripPurpose || null,
        trip_note: tripPurpose === 'Other' ? (tripNote?.trim() || null) : null,
      },
    });

    return NextResponse.json({ success: true, id: checkin.id });
  } catch (err) {
    console.error('vehicle-checkin POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
