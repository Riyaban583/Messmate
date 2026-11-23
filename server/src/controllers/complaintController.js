import { supabase, isSupabaseConfigured } from "../config/supabase.js";

let complaintStore = [
  {
    id: "cmp-101",
    userId: "user-student-1",
    studentName: "Aarav Sharma",
    studentEmail: "student@hostel.edu",
    roomNumber: "302",
    category: "Food Quality",
    meal: "Lunch",
    priority: "High",
    status: "In Progress",
    title: "Undercooked Rice in Lunch",
    description: "The rice served today in lunch was undercooked and hard to digest.",
    adminResponse: "Mess chef notified. We are recalibrating the steamer settings.",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "cmp-102",
    userId: "user-student-2",
    studentName: "Anonymous Student",
    studentEmail: "hidden@hostel.edu",
    roomNumber: "N/A",
    category: "Hygiene",
    meal: "Breakfast",
    priority: "Urgent",
    status: "Resolved",
    title: "Unwashed Spoons at Counter",
    description: "Found grease stains on cutlery at the breakfast counter.",
    adminResponse: "Deep cleaning conducted and dishwasher temperature increased. Issue resolved.",
    resolvedAt: new Date().toISOString(),
    isAnonymous: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mapComplaintFromSupabase = (c) => ({
  id: c.id,
  userId: c.user_id,
  studentName: c.student_name,
  studentEmail: c.student_email,
  roomNumber: c.room_number,
  category: c.category,
  meal: c.meal,
  priority: c.priority,
  status: c.status,
  title: c.title,
  description: c.description,
  adminResponse: c.admin_response,
  isAnonymous: c.is_anonymous,
  createdAt: c.created_at,
  resolvedAt: c.resolved_at,
});

export const submitComplaint = async (req, res) => {
  try {
    const { category, meal, priority, title, description, isAnonymous } = req.body;
    const userId = req.user ? (req.user.id || req.user._id) : "user-student-1";
    const studentName = isAnonymous ? "Anonymous Student" : (req.user ? req.user.name : "Aarav Sharma");
    const studentEmail = req.user ? req.user.email : "student@hostel.edu";
    const roomNumber = req.user?.roomNumber || "302";

    if (!category || !title || !description) {
      return res.status(400).json({ success: false, message: "Category, title, and description are required." });
    }

    if (isSupabaseConfigured() && supabase) {
      const ticketId = `cmp_${Math.floor(Date.now() / 1000)}`;

      let validUserId = null;
      if (userId) {
        try {
          const { data: userRow } = await supabase
            .from("users")
            .select("id")
            .eq("id", userId)
            .maybeSingle();
          if (userRow) validUserId = userRow.id;
        } catch {
          validUserId = null;
        }
      }

      const newRecord = {
        id: ticketId,
        user_id: validUserId,
        student_name: studentName,
        student_email: studentEmail,
        room_number: roomNumber,
        category,
        meal: meal || "General",
        priority: priority || "Medium",
        status: "Pending",
        title: title.trim(),
        description: description.trim(),
        admin_response: "",
        is_anonymous: Boolean(isAnonymous),
        created_at: new Date().toISOString(),
      };

      const { data: created, error } = await supabase
        .from("complaints")
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        console.error("[Supabase] Failed to insert complaint into Supabase:", error.message);
        if (error.code === "PGRST205") {
          console.warn("[Supabase] Missing table: 'public.complaints' does not exist yet. Run 'supabase/schema.sql' in your Supabase SQL editor.");
        }
        return res.status(500).json({
          success: false,
          message: `Failed to save complaint to the database: ${error.message}`,
        });
      } else if (created) {
        return res.status(201).json({
          success: true,
          message: "Complaint registered successfully in Supabase. Ticket ID generated.",
          data: mapComplaintFromSupabase(created),
        });
      }
    }

    const newComplaint = {
      id: `cmp-${Date.now()}`,
      userId,
      studentName,
      studentEmail,
      roomNumber,
      category,
      meal: meal || "General",
      priority: priority || "Medium",
      status: "Pending",
      title: title.trim(),
      description: description.trim(),
      adminResponse: "",
      isAnonymous: Boolean(isAnonymous),
      createdAt: new Date().toISOString(),
    };

    complaintStore.unshift(newComplaint);

    return res.status(201).json({
      success: true,
      message: "Complaint registered successfully. Ticket ID generated.",
      data: newComplaint,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyComplaints = async (req, res) => {
  const userId = req.user ? (req.user.id || req.user._id) : "user-student-1";

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return res.status(200).json({
        success: true,
        data: data.map(mapComplaintFromSupabase),
      });
    }
  }

  const myComplaints = complaintStore.filter((c) => c.userId === userId || !req.user);
  return res.status(200).json({
    success: true,
    data: myComplaints,
  });
};

export const getAdminComplaints = async (req, res) => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map(mapComplaintFromSupabase);
      return res.status(200).json({
        success: true,
        count: formatted.length,
        data: formatted,
      });
    }
  }

  return res.status(200).json({
    success: true,
    count: complaintStore.length,
    data: complaintStore,
  });
};

export const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status, adminResponse } = req.body;

  if (isSupabaseConfigured() && supabase) {
    const updatePayload = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (adminResponse !== undefined) updatePayload.admin_response = adminResponse;
    if (status === "Resolved") updatePayload.resolved_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from("complaints")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (!error && updated) {
      return res.status(200).json({
        success: true,
        message: "Complaint ticket updated successfully in Supabase.",
        data: mapComplaintFromSupabase(updated),
      });
    }

    console.error("[Supabase] Failed to update complaint:", error?.message || "Complaint not found.");
    return res.status(error ? 500 : 404).json({
      success: false,
      message: error
        ? `Failed to update complaint in the database: ${error.message}`
        : "Complaint ticket not found.",
    });
  }

  const complaint = complaintStore.find((c) => c.id === id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: "Complaint ticket not found." });
  }

  if (status) complaint.status = status;
  if (adminResponse !== undefined) complaint.adminResponse = adminResponse;
  if (status === "Resolved") complaint.resolvedAt = new Date().toISOString();

  return res.status(200).json({
    success: true,
    message: "Complaint ticket updated successfully.",
    data: complaint,
  });
};
