import { supabase, isSupabaseConfigured } from "../config/supabase.js";

let feedbackStore = [
  {
    id: "fb-1",
    userId: "user-student-1",
    userName: "Aarav Sharma",
    foodName: "Rajma Chawal",
    mealType: "Lunch",
    rating: 5,
    comment: "Tasted awesome today! Perfect spices.",
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: "fb-2",
    userId: "user-student-1",
    userName: "Aarav Sharma",
    foodName: "Paneer Butter Masala",
    mealType: "Dinner",
    rating: 4,
    comment: "Good quality paneer.",
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  },
];

export const submitFeedback = async (req, res) => {
  try {
    const { foodName, mealType, rating, comment } = req.body;
    const userId = req.user ? (req.user.id || req.user._id) : "user-student-1";
    const userName = req.user ? req.user.name : "Aarav Sharma";
    const today = new Date().toISOString().split("T")[0];

    if (!foodName || !rating) {
      return res.status(400).json({ success: false, message: "Food item and rating are required." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5 stars." });
    }

    if (isSupabaseConfigured() && supabase) {
      // Duplicate check for user + foodName + date
      const { data: existingFb } = await supabase
        .from("feedbacks")
        .select("*")
        .eq("user_id", userId)
        .eq("food_name", foodName)
        .eq("date", today)
        .maybeSingle();

      if (existingFb) {
        return res.status(409).json({
          success: false,
          message: "You have already submitted feedback for this food item today.",
        });
      }

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

      const feedbackRecord = {
        id: `fb_${Date.now()}`,
        user_id: validUserId,
        user_name: userName,
        food_name: foodName,
        meal_type: mealType || "General",
        rating: Number(rating),
        comment: comment ? comment.trim().slice(0, 300) : "",
        date: today,
        created_at: new Date().toISOString(),
      };

      const { data: created, error } = await supabase
        .from("feedbacks")
        .insert([feedbackRecord])
        .select()
        .single();

      if (error) {
        console.error("[Supabase] Failed to insert feedback into Supabase:", error.message);
        if (error.code === "PGRST205") {
          console.warn("[Supabase] Missing table: 'public.feedbacks' does not exist yet. Run 'supabase/schema.sql' in your Supabase SQL editor.");
        }
        return res.status(500).json({
          success: false,
          message: `Failed to save feedback to the database: ${error.message}`,
        });
      } else if (created) {
        return res.status(201).json({
          success: true,
          message: "Feedback submitted successfully to Supabase!",
          data: {
            id: created.id,
            userId: created.user_id,
            userName: created.user_name,
            foodName: created.food_name,
            mealType: created.meal_type,
            rating: created.rating,
            comment: created.comment,
            date: created.date,
            createdAt: created.created_at,
          },
        });
      }
    }

    // Duplicate check for local store
    const duplicate = feedbackStore.find(
      (f) => f.userId === userId && f.foodName.toLowerCase() === foodName.toLowerCase() && f.date === today
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted feedback for this food item today.",
      });
    }

    const newFeedback = {
      id: `fb-${Date.now()}`,
      userId,
      userName,
      foodName,
      mealType: mealType || "General",
      rating: Number(rating),
      comment: comment ? comment.trim().slice(0, 300) : "",
      date: today,
      createdAt: new Date().toISOString(),
    };

    feedbackStore.unshift(newFeedback);

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      data: newFeedback,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyFeedback = async (req, res) => {
  const userId = req.user ? (req.user.id || req.user._id) : "user-student-1";

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map((f) => ({
        id: f.id,
        userId: f.user_id,
        userName: f.user_name,
        foodName: f.food_name,
        mealType: f.meal_type,
        rating: f.rating,
        comment: f.comment,
        date: f.date,
        createdAt: f.created_at,
      }));
      return res.status(200).json({ success: true, data: formatted });
    }
  }

  const userFeedback = feedbackStore.filter((f) => f.userId === userId);
  return res.status(200).json({
    success: true,
    data: userFeedback,
  });
};

export const getAdminFeedback = async (req, res) => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map((f) => ({
        id: f.id,
        userId: f.user_id,
        userName: f.user_name,
        foodName: f.food_name,
        mealType: f.meal_type,
        rating: f.rating,
        comment: f.comment,
        date: f.date,
        createdAt: f.created_at,
      }));
      return res.status(200).json({
        success: true,
        count: formatted.length,
        data: formatted,
      });
    }
  }

  return res.status(200).json({
    success: true,
    count: feedbackStore.length,
    data: feedbackStore,
  });
};
