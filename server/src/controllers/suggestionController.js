import { supabase, isSupabaseConfigured } from "../config/supabase.js";

let suggestionStore = [
  {
    id: "sug-1",
    userId: "user-student-1",
    submittedBy: "Aarav Sharma",
    title: "Add Pav Bhaji to Weekend Snacks",
    description: "Pav Bhaji is a favorite dish among hostelites and perfect for Saturday evenings.",
    category: "Snacks",
    dietary: "Veg",
    status: "Approved",
    upvotes: ["user-student-1", "user-student-2", "user-student-3", "user-student-4"],
    upvoteCount: 42,
    adminComment: "Scheduled for Saturday evening snacks menu!",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "sug-2",
    userId: "user-student-3",
    submittedBy: "Priya Patel",
    title: "Cold Coffee with Ice Cream",
    description: "Request to include cold coffee option during hot summer afternoons.",
    category: "Snacks",
    dietary: "Veg",
    status: "Under Review",
    upvotes: ["user-student-3", "user-student-5"],
    upvoteCount: 28,
    adminComment: "Checking vendor feasibility for cold coffee dispenser.",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mapSuggestionFromSupabase = (s) => ({
  id: s.id,
  userId: s.user_id,
  submittedBy: s.submitted_by,
  title: s.title,
  description: s.description,
  category: s.category,
  dietary: s.dietary,
  status: s.status,
  upvotes: Array.isArray(s.upvotes) ? s.upvotes : [],
  upvoteCount: s.upvote_count || 0,
  adminComment: s.admin_comment || "",
  createdAt: s.created_at,
});

export const getSuggestions = async (req, res) => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("upvote_count", { ascending: false });

    if (!error && data) {
      return res.status(200).json({
        success: true,
        data: data.map(mapSuggestionFromSupabase),
      });
    }
  }

  return res.status(200).json({
    success: true,
    data: suggestionStore,
  });
};

export const submitSuggestion = async (req, res) => {
  const { title, description, category, dietary } = req.body;
  const userId = req.user ? (req.user.id || req.user._id) : "user-student-1";
  const submittedBy = req.user ? req.user.name : "Aarav Sharma";

  if (!title || !description || !category) {
    return res.status(400).json({ success: false, message: "Title, description, and category are required." });
  }

  if (isSupabaseConfigured() && supabase) {
    const sugId = `sug_${Date.now()}`;

    // Verify if userId exists in users table to prevent foreign key violation
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
      id: sugId,
      user_id: validUserId,
      submitted_by: submittedBy,
      title: title.trim(),
      description: description.trim(),
      category,
      dietary: dietary || "Veg",
      status: "Under Review",
      upvotes: userId ? [userId] : [],
      upvote_count: 1,
      admin_comment: "",
      created_at: new Date().toISOString(),
    };

    const { data: created, error } = await supabase
      .from("suggestions")
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      console.error("[Supabase] Failed to insert suggestion into Supabase:", error.message);
      if (error.code === "PGRST205") {
        console.warn("[Supabase] Missing table: 'public.suggestions' does not exist yet. Run 'supabase/schema.sql' in your Supabase SQL editor.");
      }
    } else if (created) {
      return res.status(201).json({
        success: true,
        message: "Food suggestion submitted for community voting in Supabase!",
        data: mapSuggestionFromSupabase(created),
      });
    }
  }

  const newSuggestion = {
    id: `sug-${Date.now()}`,
    userId,
    submittedBy,
    title: title.trim(),
    description: description.trim(),
    category,
    dietary: dietary || "Veg",
    status: "Under Review",
    upvotes: [userId],
    upvoteCount: 1,
    adminComment: "",
    createdAt: new Date().toISOString(),
  };

  suggestionStore.unshift(newSuggestion);

  return res.status(201).json({
    success: true,
    message: "Food suggestion submitted for community voting!",
    data: newSuggestion,
  });
};

export const voteSuggestion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? (req.user.id || req.user._id) : `anon-${Date.now()}`;

  if (isSupabaseConfigured() && supabase) {
    const { data: item } = await supabase
      .from("suggestions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (item) {
      let upvoteList = Array.isArray(item.upvotes) ? [...item.upvotes] : [];
      const existingIdx = upvoteList.indexOf(userId);
      let hasVoted = false;

      if (existingIdx > -1) {
        upvoteList.splice(existingIdx, 1);
        hasVoted = false;
      } else {
        upvoteList.push(userId);
        hasVoted = true;
      }

      const updatedCount = upvoteList.length;

      const { data: updated, error } = await supabase
        .from("suggestions")
        .update({ upvotes: upvoteList, upvote_count: updatedCount })
        .eq("id", id)
        .select()
        .single();

      if (!error && updated) {
        return res.status(200).json({
          success: true,
          message: hasVoted ? "Upvote added in Supabase!" : "Upvote removed from Supabase.",
          data: mapSuggestionFromSupabase(updated),
        });
      }
    }
  }

  const item = suggestionStore.find((s) => s.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Suggestion not found." });
  }

  const existingIdx = item.upvotes.indexOf(userId);
  let hasVoted = false;

  if (existingIdx > -1) {
    item.upvotes.splice(existingIdx, 1);
    item.upvoteCount = Math.max(0, item.upvoteCount - 1);
    hasVoted = false;
  } else {
    item.upvotes.push(userId);
    item.upvoteCount += 1;
    hasVoted = true;
  }

  return res.status(200).json({
    success: true,
    message: hasVoted ? "Upvote added!" : "Upvote removed.",
    data: item,
  });
};

export const updateSuggestionStatus = async (req, res) => {
  const { id } = req.params;
  const { status, adminComment } = req.body;

  if (isSupabaseConfigured() && supabase) {
    const updatePayload = {};
    if (status) updatePayload.status = status;
    if (adminComment !== undefined) updatePayload.admin_comment = adminComment;

    const { data: updated, error } = await supabase
      .from("suggestions")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (!error && updated) {
      return res.status(200).json({
        success: true,
        message: "Suggestion status updated in Supabase.",
        data: mapSuggestionFromSupabase(updated),
      });
    }
  }

  const item = suggestionStore.find((s) => s.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Suggestion not found." });
  }

  if (status) item.status = status;
  if (adminComment !== undefined) item.adminComment = adminComment;

  return res.status(200).json({
    success: true,
    message: "Suggestion status updated.",
    data: item,
  });
};
