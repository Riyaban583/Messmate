import { useState, useEffect } from "react";
import { Plus, Trash2, CalendarDays, Check } from "lucide-react";
import { getStoredWeeklyMenu, saveWeeklyMenu } from "../services/mockData";
import { menuApi } from "../services/api";
import { useToast } from "../context/ToastContext";

const daysList = [
  { dayId: "mon", label: "Monday" },
  { dayId: "tue", label: "Tuesday" },
  { dayId: "wed", label: "Wednesday" },
  { dayId: "thu", label: "Thursday" },
  { dayId: "fri", label: "Friday" },
  { dayId: "sat", label: "Saturday" },
  { dayId: "sun", label: "Sunday" },
];

export default function ManageMenu() {
  const toast = useToast();
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [selectedDayId, setSelectedDayId] = useState("mon");

  const [newItem, setNewItem] = useState({
    mealType: "lunch",
    name: "",
    type: "veg",
    calories: "220",
    description: "",
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuApi.list();
        if (res?.data) {
          // normalize format if needed
        }
      } catch (err) {
        // fallback
      }
      setWeeklyMenu(getStoredWeeklyMenu());
    };
    fetchMenu();
  }, []);

  const activeDayData = weeklyMenu.find((d) => d.dayId === selectedDayId) || weeklyMenu[0];

  const addItem = async () => {
    if (!newItem.name.trim()) return;

    const itemToAdd = {
      id: `${selectedDayId}-${newItem.mealType.slice(0, 1)}${Date.now()}`,
      name: newItem.name.trim(),
      type: newItem.type,
      dietary: newItem.type === "veg" ? "Veg" : newItem.type === "non-veg" ? "Non-Veg" : newItem.type === "jain" ? "Jain" : "Special",
      avgRating: 4.5,
      ratingCount: 1,
      calories: parseInt(newItem.calories) || 200,
      description: newItem.description.trim() || "Freshly prepared dish",
    };

    const updatedMenu = weeklyMenu.map((dayObj) => {
      if (dayObj.dayId === selectedDayId) {
        return {
          ...dayObj,
          meals: dayObj.meals.map((m) =>
            m.mealType === newItem.mealType
              ? { ...m, items: [...m.items, itemToAdd] }
              : m
          ),
        };
      }
      return dayObj;
    });

    setWeeklyMenu(updatedMenu);
    saveWeeklyMenu(updatedMenu);

    try {
      await menuApi.update(activeDayData.day, { meals: updatedMenu });
      toast.success(`Added "${newItem.name}" to ${activeDayData?.day}'s ${newItem.mealType}!`);
    } catch (err) {
      toast.success(`Added "${newItem.name}" to menu!`);
    }

    setNewItem({ mealType: "lunch", name: "", type: "veg", calories: "220", description: "" });
  };

  const removeItem = (mealType, id) => {
    const updatedMenu = weeklyMenu.map((dayObj) => {
      if (dayObj.dayId === selectedDayId) {
        return {
          ...dayObj,
          meals: dayObj.meals.map((m) =>
            m.mealType === mealType
              ? { ...m, items: m.items.filter((i) => i.id !== id && i._id !== id) }
              : m
          ),
        };
      }
      return dayObj;
    });

    setWeeklyMenu(updatedMenu);
    saveWeeklyMenu(updatedMenu);
    toast.success("Dish removed from menu.");
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary border border-primary-100 text-xs font-bold">
            <CalendarDays size={14} />
            <span>Admin Weekly Schedule Editor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-primary pt-1">
            Manage 7-Day Weekly Menu
          </h1>
          <p className="text-sm text-ink-secondary">
            Add, edit, or delete food dishes from Monday to Sunday across all meal slots.
          </p>
        </div>
      </div>

      {/* Day Selector */}
      <div className="card p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-white">
        {daysList.map((d) => (
          <button
            key={d.dayId}
            onClick={() => setSelectedDayId(d.dayId)}
            className={`flex-1 min-w-[90px] text-xs font-bold py-2.5 px-3 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
              selectedDayId === d.dayId
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-surface-muted text-ink-secondary border-border/80 hover:bg-white"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Add New Item Form */}
      <div className="card space-y-4 border-2 border-primary/20 bg-white shadow-sm">
        <h2 className="text-base font-bold font-display text-ink-primary border-b border-border/70 pb-2">
          Add Dish to {activeDayData?.day}'s Menu
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold block mb-1">Meal Slot</label>
            <select
              value={newItem.mealType}
              onChange={(e) => setNewItem({ ...newItem, mealType: e.target.value })}
              className="w-full bg-surface-muted/40 border border-border rounded-xl px-3 py-2 text-xs capitalize font-medium focus:outline-none"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Evening Snacks</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Dish Name *</label>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full bg-surface-muted/40 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary"
              placeholder="e.g. Paneer Butter Masala"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Dietary Type</label>
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              className="w-full bg-surface-muted/40 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            >
              <option value="veg">🟢 Pure Veg</option>
              <option value="non-veg">🔴 Non-Veg / Egg</option>
              <option value="special">✨ Chef Special</option>
              <option value="jain">🍃 Jain Friendly</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Calories (kcal)</label>
            <input
              type="number"
              value={newItem.calories}
              onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })}
              className="w-full bg-surface-muted/40 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
              placeholder="240"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold block mb-1">Description / Ingredients</label>
          <input
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="w-full bg-surface-muted/40 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary"
            placeholder="e.g. Cottage cheese cooked in creamy tomato butter gravy"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button onClick={addItem} className="btn-primary text-xs shadow-md">
            <Plus size={16} />
            <span>Add Dish to {activeDayData?.day}</span>
          </button>
        </div>
      </div>

      {/* Active Day Menu Grid */}
      {activeDayData && (
        <div className="grid md:grid-cols-2 gap-6">
          {activeDayData.meals.map((meal) => (
            <div key={meal.mealType} className="card space-y-3 bg-white">
              <div className="flex items-center justify-between border-b border-border/70 pb-2">
                <h3 className="text-base font-bold capitalize text-ink-primary font-display">{meal.mealType}</h3>
                <span className="text-xs font-semibold text-ink-muted bg-surface-muted px-2.5 py-0.5 rounded-full border border-border/60">
                  {meal.items.length} dishes
                </span>
              </div>

              <ul className="space-y-2">
                {meal.items.map((item, idx) => (
                  <li
                    key={item.id || item._id || idx}
                    className="p-3 rounded-xl bg-surface-page/70 border border-border/60 flex items-center justify-between gap-2 hover:bg-white transition-colors"
                  >
                    <div>
                      <span className="font-bold text-xs text-ink-primary">{item.name}</span>
                      <p className="text-[10px] text-ink-muted capitalize">{item.type || item.dietary || "veg"} • {item.calories || 200} kcal</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(meal.mealType, item.id || item._id)}
                      className="text-ink-muted hover:text-danger p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
