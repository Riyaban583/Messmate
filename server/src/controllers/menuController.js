import { supabase, isSupabaseConfigured } from "../config/supabase.js";

// Initial mock menu fallback data
let weeklyMenuData = {
  Monday: {
    day: "Monday",
    date: "2026-08-31",
    meals: {
      breakfast: { time: "7:30 AM - 9:30 AM", items: [{ name: "Aloo Paratha with Curd", dietary: "Veg", rating: 4.5, calories: 340 }, { name: "Boiled Eggs / Omelette", dietary: "Non-Veg", rating: 4.2, calories: 180 }, { name: "Tea & Coffee", dietary: "Veg", rating: 4.1, calories: 80 }] },
      lunch: { time: "12:30 PM - 2:30 PM", items: [{ name: "Rajma Chawal", dietary: "Veg", rating: 4.8, calories: 450 }, { name: "Jeera Rice & Tandoori Roti", dietary: "Veg", rating: 4.4, calories: 280 }, { name: "Mixed Veg Salad & Boondi Raita", dietary: "Veg", rating: 4.3, calories: 120 }] },
      snacks: { time: "5:00 PM - 6:00 PM", items: [{ name: "Samosa with Mint Chutney", dietary: "Veg", rating: 4.6, calories: 250 }, { name: "Hot Masala Chai", dietary: "Veg", rating: 4.7, calories: 90 }] },
      dinner: { time: "7:30 PM - 9:30 PM", items: [{ name: "Paneer Butter Masala", dietary: "Veg", rating: 4.7, calories: 420 }, { name: "Chicken Curry (Optional)", dietary: "Non-Veg", rating: 4.6, calories: 480 }, { name: "Dal Tadka & Steamed Rice", dietary: "Veg", rating: 4.2, calories: 310 }, { name: "Gulab Jamun", dietary: "Special", rating: 4.9, calories: 220 }] }
    }
  },
  Tuesday: {
    day: "Tuesday",
    date: "2026-09-01",
    meals: {
      breakfast: { time: "7:30 AM - 9:30 AM", items: [{ name: "Idli Sambar & Coconut Chutney", dietary: "Veg", rating: 4.3, calories: 280 }, { name: "Vada", dietary: "Veg", rating: 4.1, calories: 210 }] },
      lunch: { time: "12:30 PM - 2:30 PM", items: [{ name: "Kadhi Pakoda", dietary: "Veg", rating: 4.0, calories: 380 }, { name: "Aloo Gobi & Plain Paratha", dietary: "Veg", rating: 3.9, calories: 320 }] },
      snacks: { time: "5:00 PM - 6:00 PM", items: [{ name: "Bread Pakoda", dietary: "Veg", rating: 3.8, calories: 290 }, { name: "Coffee", dietary: "Veg", rating: 4.0, calories: 85 }] },
      dinner: { time: "7:30 PM - 9:30 PM", items: [{ name: "Egg Curry / Malai Kofta", dietary: "Non-Veg", rating: 4.3, calories: 390 }, { name: "Jeera Rice & Chapati", dietary: "Veg", rating: 4.1, calories: 290 }] }
    }
  },
  Wednesday: {
    day: "Wednesday",
    date: "2026-09-02",
    meals: {
      breakfast: { time: "7:30 AM - 9:30 AM", items: [{ name: "Poha with Sev & Peanuts", dietary: "Veg", rating: 4.4, calories: 260 }, { name: "Boiled Eggs", dietary: "Non-Veg", rating: 4.2, calories: 150 }] },
      lunch: { time: "12:30 PM - 2:30 PM", items: [{ name: "Chole Bhature", dietary: "Special", rating: 4.9, calories: 550 }, { name: "Pulao & Onion Salad", dietary: "Veg", rating: 4.5, calories: 310 }] },
      snacks: { time: "5:00 PM - 6:00 PM", items: [{ name: "Pav Bhaji", dietary: "Veg", rating: 4.8, calories: 380 }, { name: "Tea", dietary: "Veg", rating: 4.6, calories: 80 }] },
      dinner: { time: "7:30 PM - 9:30 PM", items: [{ name: "Butter Chicken", dietary: "Non-Veg", rating: 4.9, calories: 510 }, { name: "Paneer Tikka Masala", dietary: "Special", rating: 4.8, calories: 430 }, { name: "Naan & Rice", dietary: "Veg", rating: 4.5, calories: 320 }] }
    }
  },
  Thursday: {
    day: "Thursday",
    date: "2026-09-03",
    meals: {
      breakfast: { time: "7:30 AM - 9:30 AM", items: [{ name: "Masala Dosa with Sambhar", dietary: "Veg", rating: 4.6, calories: 320 }] },
      lunch: { time: "12:30 PM - 2:30 PM", items: [{ name: "Dal Makhani & Shahi Paneer", dietary: "Veg", rating: 4.7, calories: 460 }] },
      snacks: { time: "5:00 PM - 6:00 PM", items: [{ name: "Veg Cutlet & Tea", dietary: "Veg", rating: 4.2, calories: 230 }] },
      dinner: { time: "7:30 PM - 9:30 PM", items: [{ name: "Mix Veg Sabzi & Rice", dietary: "Veg", rating: 3.9, calories: 290 }] }
    }
  },
  Friday: {
    day: "Friday",
    date: "2026-09-04",
    meals: {
      breakfast: { time: "7:30 AM - 9:30 AM", items: [{ name: "Puri Bhaji", dietary: "Veg", rating: 4.3, calories: 410 }] },
      lunch: { time: "12:30 PM - 2:30 PM", items: [{ name: "Hyderabadi Veg Biryani", dietary: "Veg", rating: 4.6, calories: 440 }] },
      snacks: { time: "5:00 PM - 6:00 PM", items: [{ name: "French Fries & Coffee", dietary: "Veg", rating: 4.5, calories: 310 }] },
      dinner: { time: "7:30 PM - 9:30 PM", items: [{ name: "Fish Curry / Kadai Paneer", dietary: "Non-Veg", rating: 4.4, calories: 430 }] }
    }
  },
  Saturday: {
    day: "Saturday",
    date: "2026-09-05",
    meals: {
      breakfast: { time: "7:30 AM - 9:30 AM", items: [{ name: "Uttapam with Chutney", dietary: "Veg", rating: 4.2, calories: 290 }] },
      lunch: { time: "12:30 PM - 2:30 PM", items: [{ name: "Bhindi Masala & Dal Fry", dietary: "Veg", rating: 4.0, calories: 310 }] },
      snacks: { time: "5:00 PM - 6:00 PM", items: [{ name: "Maggi Noodles & Tea", dietary: "Veg", rating: 4.7, calories: 340 }] },
      dinner: { time: "7:30 PM - 9:30 PM", items: [{ name: "Special Veg Thali", dietary: "Special", rating: 4.6, calories: 480 }] }
    }
  },
  Sunday: {
    day: "Sunday",
    date: "2026-09-06",
    meals: {
      breakfast: { time: "7:30 AM - 9:30 AM", items: [{ name: "Chole Kulche", dietary: "Special", rating: 4.8, calories: 470 }] },
      lunch: { time: "12:30 PM - 2:30 PM", items: [{"name": "Chicken Biryani / Paneer Biryani", dietary: "Special", rating: 4.9, calories: 560}, {"name": "Raita & Ice Cream", dietary: "Special", rating: 4.9, calories: 190}]},
      snacks: { time: "5:00 PM - 6:00 PM", items: [{ name: "Pastry & Cold Coffee", dietary: "Special", rating: 4.8, calories: 260 }] },
      dinner: { time: "7:30 PM - 9:30 PM", items: [{ name: "Light Khichdi & Papad", dietary: "Veg", rating: 4.0, calories: 230 }] }
    }
  }
};

export const getTodayMenu = async (req, res) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = days[new Date().getDay()];

  if (isSupabaseConfigured() && supabase) {
    const { data: menuRow, error } = await supabase
      .from("menus")
      .select("*")
      .eq("day", todayName)
      .maybeSingle();

    if (menuRow && menuRow.meals) {
      return res.status(200).json({
        success: true,
        data: {
          day: menuRow.day,
          date: menuRow.date || new Date().toISOString().split("T")[0],
          meals: menuRow.meals,
        },
      });
    }
  }

  const menu = weeklyMenuData[todayName] || weeklyMenuData["Monday"];
  return res.status(200).json({
    success: true,
    data: menu,
  });
};

export const getWeeklyMenu = async (req, res) => {
  if (isSupabaseConfigured() && supabase) {
    const { data: menuRows, error } = await supabase.from("menus").select("*");

    if (menuRows && menuRows.length > 0) {
      const formattedWeekly = {};
      menuRows.forEach((row) => {
        formattedWeekly[row.day] = {
          day: row.day,
          date: row.date || new Date().toISOString().split("T")[0],
          meals: row.meals,
        };
      });

      // Fill any missing days with mock defaults
      Object.keys(weeklyMenuData).forEach((dayKey) => {
        if (!formattedWeekly[dayKey]) {
          formattedWeekly[dayKey] = weeklyMenuData[dayKey];
        }
      });

      return res.status(200).json({
        success: true,
        data: formattedWeekly,
      });
    }
  }

  return res.status(200).json({
    success: true,
    data: weeklyMenuData,
  });
};

export const updateMenu = async (req, res) => {
  const { day, meals } = req.body;
  if (!day) {
    return res.status(400).json({ success: false, message: "Day must be specified." });
  }

  if (isSupabaseConfigured() && supabase) {
    const { data: existingRow } = await supabase
      .from("menus")
      .select("*")
      .eq("day", day)
      .maybeSingle();

    let updatedMeals = meals;
    if (existingRow && existingRow.meals && meals) {
      updatedMeals = { ...existingRow.meals, ...meals };
    }

    const { data, error } = await supabase
      .from("menus")
      .upsert(
        {
          day,
          date: existingRow?.date || new Date().toISOString().split("T")[0],
          meals: updatedMeals,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "day" }
      )
      .select()
      .single();

    if (!error && data) {
      // Also sync to local cache
      if (weeklyMenuData[day]) {
        weeklyMenuData[day].meals = updatedMeals;
      }

      return res.status(200).json({
        success: true,
        message: `Menu for ${day} updated successfully in Supabase!`,
        data: { day: data.day, date: data.date, meals: data.meals },
      });
    }

    console.error("[Supabase] Failed to update menu:", error?.message || "No menu row returned.");
    return res.status(500).json({
      success: false,
      message: `Failed to save menu to the database: ${error?.message || "No menu row returned."}`,
    });
  }

  // Fallback update
  if (weeklyMenuData[day]) {
    if (meals) {
      weeklyMenuData[day].meals = { ...weeklyMenuData[day].meals, ...meals };
    }
    return res.status(200).json({
      success: true,
      message: `Menu for ${day} updated successfully!`,
      data: weeklyMenuData[day],
    });
  }

  return res.status(400).json({ success: false, message: "Invalid day specified." });
};
