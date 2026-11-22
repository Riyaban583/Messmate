// Full 7-Day Weekly Mess Menu Dataset with Dietary Badges & Nutritional Info

export const initialWeeklyMenu = [
  {
    day: "Monday",
    dayId: "mon",
    meals: [
      {
        mealType: "breakfast",
        time: "07:30 AM - 09:30 AM",
        items: [
          { id: "mon-b1", name: "Indori Poha & Sev", type: "veg", avgRating: 4.3, ratingCount: 142, calories: 280, description: "Flattened rice cooked with turmeric, mustard seeds & peanuts" },
          { id: "mon-b2", name: "Sprouted Moong Salad", type: "veg", avgRating: 4.1, ratingCount: 95, calories: 120, description: "Fresh sprouted lentils with lemon juice and spices" },
          { id: "mon-b3", name: "Hot Milk / Tea / Coffee", type: "veg", avgRating: 4.0, ratingCount: 210, calories: 150, description: "Choice of warm beverages" },
          { id: "mon-b4", name: "Fresh Banana", type: "veg", avgRating: 4.5, ratingCount: 180, calories: 90, description: "Rich in potassium & natural energy" },
        ],
      },
      {
        mealType: "lunch",
        time: "12:00 PM - 02:30 PM",
        items: [
          { id: "mon-l1", name: "Steamed Basmati Rice", type: "veg", avgRating: 4.1, ratingCount: 230, calories: 210, description: "Fluffy long-grain rice" },
          { id: "mon-l2", name: "Dal Tadka", type: "veg", avgRating: 4.2, ratingCount: 195, calories: 180, description: "Yellow lentils tempered with garlic, cumin, and ghee" },
          { id: "mon-l3", name: "Paneer Butter Masala", type: "special", avgRating: 4.7, ratingCount: 310, calories: 340, description: "Rich cottage cheese curry in tomatoes and cashew cream" },
          { id: "mon-l4", name: "Butter Phulka Roti", type: "veg", avgRating: 4.4, ratingCount: 280, calories: 140, description: "Freshly tossed whole wheat flatbreads" },
          { id: "mon-l5", name: "Cucumber Mint Salad & Boondi Raita", type: "veg", avgRating: 4.3, ratingCount: 160, calories: 110, description: "Cool yogurt condiment" },
        ],
      },
      {
        mealType: "snacks",
        time: "05:00 PM - 06:00 PM",
        items: [
          { id: "mon-s1", name: "Crispy Samosa with Green Chutney", type: "special", avgRating: 4.6, ratingCount: 290, calories: 260, description: "Fried pastry filled with spiced potatoes and peas" },
          { id: "mon-s2", name: "Masala Chai", type: "veg", avgRating: 4.5, ratingCount: 240, calories: 110, description: "Indian aromatic spiced tea" },
        ],
      },
      {
        mealType: "dinner",
        time: "07:30 PM - 09:30 PM",
        items: [
          { id: "mon-d1", name: "Jeera Rice", type: "veg", avgRating: 4.2, ratingCount: 190, calories: 220, description: "Basmati rice sauteed with aromatic cumin" },
          { id: "mon-d2", name: "Rajma Masala", type: "veg", avgRating: 4.5, ratingCount: 265, calories: 230, description: "Red kidney beans slow cooked in onion tomato gravy" },
          { id: "mon-d3", name: "Mix Veg Dry Sabzi", type: "veg", avgRating: 3.8, ratingCount: 120, calories: 160, description: "Cauliflower, peas, beans and carrots" },
          { id: "mon-d4", name: "Hot Tawa Chapati", type: "veg", avgRating: 4.3, ratingCount: 210, calories: 130, description: "Whole wheat rotis" },
          { id: "mon-d5", name: "Gulab Jamun", type: "special", avgRating: 4.8, ratingCount: 340, calories: 190, description: "Soft milk dumplings soaked in cardamom sugar syrup" },
        ],
      },
    ],
  },
  {
    day: "Tuesday",
    dayId: "tue",
    meals: [
      {
        mealType: "breakfast",
        time: "07:30 AM - 09:30 AM",
        items: [
          { id: "tue-b1", name: "Crispy Masala Dosa", type: "special", avgRating: 4.7, ratingCount: 310, calories: 310, description: "South Indian rice crepe with spiced potato filling" },
          { id: "tue-b2", name: "Coconut Chutney & Sambhar", type: "veg", avgRating: 4.4, ratingCount: 230, calories: 140, description: "Tangy vegetable stew & coconut dip" },
          { id: "tue-b3", name: "Filter Coffee / Milk", type: "veg", avgRating: 4.6, ratingCount: 190, calories: 130, description: "Traditional South Indian brew" },
        ],
      },
      {
        mealType: "lunch",
        time: "12:00 PM - 02:30 PM",
        items: [
          { id: "tue-l1", name: "Plain Steamed Rice", type: "veg", avgRating: 4.0, ratingCount: 170, calories: 210, description: "Freshly cooked basmati" },
          { id: "tue-l2", name: "Dal Fry", type: "veg", avgRating: 4.1, ratingCount: 180, calories: 170, description: "Toor dal cooked with garlic and cumin" },
          { id: "tue-l3", name: "Kadhai Paneer", type: "special", avgRating: 4.6, ratingCount: 280, calories: 320, description: "Paneer cubes tossed with bell peppers and coarse spices" },
          { id: "tue-l4", name: "Aloo Gobi Sabzi", type: "veg", avgRating: 3.9, ratingCount: 140, calories: 150, description: "Potato and cauliflower dry curry" },
          { id: "tue-l5", name: "Soft Rotis & Green Salad", type: "veg", avgRating: 4.3, ratingCount: 210, calories: 130, description: "Flatbreads with cucumber, tomato & onion slices" },
        ],
      },
      {
        mealType: "snacks",
        time: "05:00 PM - 06:00 PM",
        items: [
          { id: "tue-s1", name: "Veg Cutlet & Tomato Ketchup", type: "veg", avgRating: 4.2, ratingCount: 175, calories: 210, description: "Pan-fried vegetable patties" },
          { id: "tue-s2", name: "Ginger Tea / Hot Milk", type: "veg", avgRating: 4.4, ratingCount: 185, calories: 100, description: "Refreshing tea with real ginger" },
        ],
      },
      {
        mealType: "dinner",
        time: "07:30 PM - 09:30 PM",
        items: [
          { id: "tue-d1", name: "Veg Pulao", type: "veg", avgRating: 4.3, ratingCount: 205, calories: 260, description: "Fragrant rice spiced with whole aromatics" },
          { id: "tue-d2", name: "Kadhi Pakoda", type: "veg", avgRating: 4.4, ratingCount: 220, calories: 240, description: "Gram flour dumplings in tangy yogurt curry" },
          { id: "tue-d3", name: "Baingan Bharta", type: "veg", avgRating: 3.7, ratingCount: 110, calories: 140, description: "Roasted eggplant mashed with onions & garlic" },
          { id: "tue-d4", name: "Whole Wheat Roti", type: "veg", avgRating: 4.2, ratingCount: 190, calories: 130, description: "Freshly puffed flatbreads" },
          { id: "tue-d5", name: "Rice Kheer", type: "special", avgRating: 4.6, ratingCount: 260, calories: 210, description: "Sweet rice pudding garnished with almonds" },
        ],
      },
    ],
  },
  {
    day: "Wednesday",
    dayId: "wed",
    meals: [
      {
        mealType: "breakfast",
        time: "07:30 AM - 09:30 AM",
        items: [
          { id: "wed-b1", name: "Aloo Paratha with Curd", type: "special", avgRating: 4.8, ratingCount: 350, calories: 380, description: "Griddled whole wheat flatbread stuffed with spiced mashed potatoes" },
          { id: "wed-b2", name: "Green Mint Chutney & Pickle", type: "veg", avgRating: 4.3, ratingCount: 190, calories: 40, description: "Tangy condiments" },
          { id: "wed-b3", name: "Sweet Lassi / Tea", type: "veg", avgRating: 4.5, ratingCount: 230, calories: 170, description: "Chilled yogurt drink" },
        ],
      },
      {
        mealType: "lunch",
        time: "12:00 PM - 02:30 PM",
        items: [
          { id: "wed-l1", name: "Chicken Curry / Veg Kofta", type: "non-veg", avgRating: 4.6, ratingCount: 340, calories: 360, description: "Homestyle chicken gravy or delicious veg kofta for vegetarian line" },
          { id: "wed-l2", name: "Yellow Dal Fry", type: "veg", avgRating: 4.1, ratingCount: 190, calories: 170, description: "Comforting yellow lentil soup" },
          { id: "wed-l3", name: "Jeera Rice", type: "veg", avgRating: 4.3, ratingCount: 210, calories: 220, description: "Cumin tempered rice" },
          { id: "wed-l4", name: "Roti & Kachumber Salad", type: "veg", avgRating: 4.3, ratingCount: 180, calories: 130, description: "Diced salad with lime dressing" },
        ],
      },
      {
        mealType: "snacks",
        time: "05:00 PM - 06:00 PM",
        items: [
          { id: "wed-s1", name: "Bhel Puri / Sev Puri", type: "veg", avgRating: 4.4, ratingCount: 210, calories: 190, description: "Crunchy puffed rice chaat with sweet & spicy chutneys" },
          { id: "wed-s2", name: "Lemon Tea / Milk", type: "veg", avgRating: 4.2, ratingCount: 160, calories: 80, description: "Warm digestive tea" },
        ],
      },
      {
        mealType: "dinner",
        time: "07:30 PM - 09:30 PM",
        items: [
          { id: "wed-d1", name: "Basmati Steamed Rice", type: "veg", avgRating: 4.0, ratingCount: 170, calories: 210, description: "Aromatic white rice" },
          { id: "wed-d2", name: "Chana Masala", type: "veg", avgRating: 4.4, ratingCount: 240, calories: 250, description: "Spiced chickpea curry cooked with roasted spices" },
          { id: "wed-d3", name: "Bhindi Masala", type: "veg", avgRating: 3.9, ratingCount: 130, calories: 140, description: "Stir-fried okra with onions and dry mango powder" },
          { id: "wed-d4", name: "Phulka Roti with Ghee", type: "veg", avgRating: 4.4, ratingCount: 210, calories: 140, description: "Soft rotis smeared with pure ghee" },
          { id: "wed-d5", name: "Fruit Custard", type: "special", avgRating: 4.7, ratingCount: 290, calories: 180, description: "Vanilla custard packed with apples, grapes and bananas" },
        ],
      },
    ],
  },
  {
    day: "Thursday",
    dayId: "thu",
    meals: [
      {
        mealType: "breakfast",
        time: "07:30 AM - 09:30 AM",
        items: [
          { id: "thu-b1", name: "Soft Idli & Medu Vada", type: "veg", avgRating: 4.5, ratingCount: 260, calories: 240, description: "Steamed rice cakes and lentil fritters" },
          { id: "thu-b2", name: "Tomato Chutney & Hot Sambhar", type: "veg", avgRating: 4.4, ratingCount: 210, calories: 120, description: "Lentil vegetable soup" },
          { id: "thu-b3", name: "Hot Tea / Milk / Bournvita", type: "veg", avgRating: 4.3, ratingCount: 190, calories: 140, description: "Morning warm beverages" },
        ],
      },
      {
        mealType: "lunch",
        time: "12:00 PM - 02:30 PM",
        items: [
          { id: "thu-l1", name: "Steamed Rice", type: "veg", avgRating: 4.0, ratingCount: 180, calories: 210, description: "Plain rice" },
          { id: "thu-l2", name: "Dal Makhani", type: "special", avgRating: 4.7, ratingCount: 320, calories: 290, description: "Slow-cooked black lentils in butter and cream gravy" },
          { id: "thu-l3", name: "Dum Aloo Kashmiri", type: "veg", avgRating: 4.3, ratingCount: 195, calories: 230, description: "Baby potatoes simmered in spiced yogurt gravy" },
          { id: "thu-l4", name: "Tawa Roti", type: "veg", avgRating: 4.2, ratingCount: 180, calories: 130, description: "Whole wheat chapati" },
          { id: "thu-l5", name: "Onion Cucumber Salad", type: "veg", avgRating: 4.1, ratingCount: 140, calories: 35, description: "Fresh sliced greens" },
        ],
      },
      {
        mealType: "snacks",
        time: "05:00 PM - 06:00 PM",
        items: [
          { id: "thu-s1", name: "Pasta in Creamy Tomato Sauce", type: "special", avgRating: 4.5, ratingCount: 250, calories: 280, description: "Penne pasta with herbs and cheese" },
          { id: "thu-s2", name: "Cold Coffee / Hot Tea", type: "veg", avgRating: 4.6, ratingCount: 220, calories: 160, description: "Refreshing beverage" },
        ],
      },
      {
        mealType: "dinner",
        time: "07:30 PM - 09:30 PM",
        items: [
          { id: "thu-d1", name: "Veg Fried Rice", type: "veg", avgRating: 4.4, ratingCount: 240, calories: 270, description: "Wok tossed rice with spring onions and veggies" },
          { id: "thu-d2", name: "Veg Manchurian Gravy", type: "veg", avgRating: 4.5, ratingCount: 260, calories: 240, description: "Fried vegetable balls in spicy garlic soy sauce" },
          { id: "thu-d3", name: "Plain Dal", type: "veg", avgRating: 3.9, ratingCount: 120, calories: 150, description: "Simple comforting yellow dal" },
          { id: "thu-d4", name: "Roti", type: "veg", avgRating: 4.1, ratingCount: 170, calories: 130, description: "Whole wheat bread" },
          { id: "thu-d5", name: "Rasgulla", type: "special", avgRating: 4.7, ratingCount: 280, calories: 160, description: "Spongy cottage cheese balls in light sugar syrup" },
        ],
      },
    ],
  },
  {
    day: "Friday",
    dayId: "fri",
    meals: [
      {
        mealType: "breakfast",
        time: "07:30 AM - 09:30 AM",
        items: [
          { id: "fri-b1", name: "Puri Bhaji (Aloo Curry)", type: "special", avgRating: 4.7, ratingCount: 330, calories: 410, description: "Deep-fried puffed bread with tangy spiced potato gravy" },
          { id: "fri-b2", name: "Halwa (Suji)", type: "special", avgRating: 4.6, ratingCount: 280, calories: 220, description: "Sweet semolina pudding cooked in ghee" },
          { id: "fri-b3", name: "Tea / Coffee / Milk", type: "veg", avgRating: 4.2, ratingCount: 200, calories: 120, description: "Choice of warm drinks" },
        ],
      },
      {
        mealType: "lunch",
        time: "12:00 PM - 02:30 PM",
        items: [
          { id: "fri-l1", name: "Hyderabadi Veg Biryani / Egg Curry", type: "special", avgRating: 4.8, ratingCount: 380, calories: 420, description: "Layered saffron basmati rice loaded with fried onions & spices" },
          { id: "fri-l2", name: "Mirchi Ka Salan", type: "veg", avgRating: 4.3, ratingCount: 190, calories: 150, description: "Peanut and sesame gravy" },
          { id: "fri-l3", name: "Onion Mint Raita", type: "veg", avgRating: 4.5, ratingCount: 210, calories: 90, description: "Chilled yogurt" },
          { id: "fri-l4", name: "Roasted Papad", type: "veg", avgRating: 4.4, ratingCount: 250, calories: 45, description: "Crispy lentil wafer" },
        ],
      },
      {
        mealType: "snacks",
        time: "05:00 PM - 06:00 PM",
        items: [
          { id: "fri-s1", name: "Vada Pav with Fried Green Chillies", type: "special", avgRating: 4.7, ratingCount: 310, calories: 290, description: "Mumbai street style potato fritter in bread bun" },
          { id: "fri-s2", name: "Masala Cutting Chai", type: "veg", avgRating: 4.6, ratingCount: 240, calories: 110, description: "Strong spiced tea" },
        ],
      },
      {
        mealType: "dinner",
        time: "07:30 PM - 09:30 PM",
        items: [
          { id: "fri-d1", name: "Jeera Basmati Rice", type: "veg", avgRating: 4.2, ratingCount: 180, calories: 220, description: "Tempered cumin rice" },
          { id: "fri-d2", name: "Dal Palak", type: "veg", avgRating: 4.2, ratingCount: 160, calories: 170, description: "Lentils cooked with fresh spinach puree" },
          { id: "fri-d3", name: "Matar Paneer", type: "special", avgRating: 4.6, ratingCount: 290, calories: 310, description: "Green peas and cottage cheese in aromatic tomato onion curry" },
          { id: "fri-d4", name: "Butter Chapati", type: "veg", avgRating: 4.3, ratingCount: 200, calories: 140, description: "Soft rotis with butter" },
          { id: "fri-d5", name: "Moong Dal Halwa", type: "special", avgRating: 4.8, ratingCount: 320, calories: 280, description: "Rich lentil sweet dessert enriched with ghee and nuts" },
        ],
      },
    ],
  },
  {
    day: "Saturday",
    dayId: "sat",
    meals: [
      {
        mealType: "breakfast",
        time: "07:30 AM - 09:30 AM",
        items: [
          { id: "sat-b1", name: "Chole Bhature", type: "special", avgRating: 4.9, ratingCount: 420, calories: 490, description: "Spicy chickpea curry paired with deep-fried fluffy bhaturas" },
          { id: "sat-b2", name: "Pickled Onion Slices", type: "veg", avgRating: 4.4, ratingCount: 210, calories: 25, description: "Sirka pyaz" },
          { id: "sat-b3", name: "Sweet Lassi / Masala Tea", type: "veg", avgRating: 4.6, ratingCount: 270, calories: 180, description: "Traditional sweet yogurt drink" },
        ],
      },
      {
        mealType: "lunch",
        time: "12:00 PM - 02:30 PM",
        items: [
          { id: "sat-l1", name: "Steamed Rice", type: "veg", avgRating: 4.0, ratingCount: 160, calories: 210, description: "Basmati rice" },
          { id: "sat-l2", name: "Sambhar & Rasam", type: "veg", avgRating: 4.3, ratingCount: 190, calories: 140, description: "Peppery tangy South Indian soup" },
          { id: "sat-l3", name: "Bhindi Do Pyaza", type: "veg", avgRating: 4.0, ratingCount: 140, calories: 160, description: "Okra cooked with caramelized onions" },
          { id: "sat-l4", name: "Soft Chapati", type: "veg", avgRating: 4.2, ratingCount: 170, calories: 130, description: "Whole wheat rotis" },
          { id: "sat-l5", name: "Fryums & Curd", type: "veg", avgRating: 4.4, ratingCount: 220, calories: 110, description: "Crispy colorful snacks and thick yogurt" },
        ],
      },
      {
        mealType: "snacks",
        time: "05:00 PM - 06:00 PM",
        items: [
          { id: "sat-s1", name: "Pav Bhaji with Extra Butter", type: "special", avgRating: 4.8, ratingCount: 390, calories: 360, description: "Mashed vegetable curry served with toasted buttered pav" },
          { id: "sat-s2", name: "Special Cutting Chai", type: "veg", avgRating: 4.6, ratingCount: 250, calories: 110, description: "Cardamom tea" },
        ],
      },
      {
        mealType: "dinner",
        time: "07:30 PM - 09:30 PM",
        items: [
          { id: "sat-d1", name: "Kashmiri Pulao", type: "special", avgRating: 4.5, ratingCount: 230, calories: 290, description: "Sweet savory rice topped with raisins & cashews" },
          { id: "sat-d2", name: "Dal Makhani", type: "special", avgRating: 4.7, ratingCount: 310, calories: 280, description: "Creamy black dal" },
          { id: "sat-d3", name: "Paneer Tikka Masala", type: "special", avgRating: 4.8, ratingCount: 360, calories: 340, description: "Char-grilled paneer in spiced gravy" },
          { id: "sat-d4", name: "Butter Naan / Roti", type: "veg", avgRating: 4.5, ratingCount: 260, calories: 160, description: "Tandoori style naan" },
          { id: "sat-d5", name: "Ice Cream Scoop (Vanilla / Chocolate)", type: "special", avgRating: 4.9, ratingCount: 450, calories: 180, description: "Chilled dessert scoop" },
        ],
      },
    ],
  },
  {
    day: "Sunday",
    dayId: "sun",
    meals: [
      {
        mealType: "breakfast",
        time: "07:30 AM - 09:30 AM",
        items: [
          { id: "sun-b1", name: "Paneer Paratha & Butter", type: "special", avgRating: 4.8, ratingCount: 360, calories: 420, description: "Stuffed paneer flatbread griddled with white butter" },
          { id: "sun-b2", name: "Curd & Pickle", type: "veg", avgRating: 4.3, ratingCount: 180, calories: 90, description: "Fresh dahi" },
          { id: "sun-b3", name: "Tea / Coffee / Hot Chocolate", type: "veg", avgRating: 4.5, ratingCount: 220, calories: 150, description: "Morning hot beverage" },
        ],
      },
      {
        mealType: "lunch",
        time: "12:00 PM - 02:30 PM",
        items: [
          { id: "sun-l1", name: "Special Sunday Feast Biryani", type: "special", avgRating: 4.9, ratingCount: 480, calories: 460, description: "Chef special dum biryani served with raita" },
          { id: "sun-l2", name: "Butter Chicken / Butter Paneer", type: "non-veg", avgRating: 4.9, ratingCount: 490, calories: 390, description: "Creamy velvety tomato butter gravy" },
          { id: "sun-l3", name: "Jeera Rice", type: "veg", avgRating: 4.3, ratingCount: 210, calories: 220, description: "Cumin basmati rice" },
          { id: "sun-l4", name: "Garlic Butter Naan", type: "special", avgRating: 4.7, ratingCount: 340, calories: 180, description: "Garlic infused naan bread" },
          { id: "sun-l5", name: "Green Salad & Boondi Raita", type: "veg", avgRating: 4.3, ratingCount: 190, calories: 100, description: "Cool yogurt condiment" },
        ],
      },
      {
        mealType: "snacks",
        time: "05:00 PM - 06:00 PM",
        items: [
          { id: "sun-s1", name: "Bread Pakoda with Sweet Chutney", type: "special", avgRating: 4.6, ratingCount: 270, calories: 280, description: "Spiced potato bread fritter fried to golden crispness" },
          { id: "sun-s2", name: "Cardamom Tea", type: "veg", avgRating: 4.5, ratingCount: 210, calories: 110, description: "Elaichi chai" },
        ],
      },
      {
        mealType: "dinner",
        time: "07:30 PM - 09:30 PM",
        items: [
          { id: "sun-d1", name: "Veg Hakka Noodles", type: "veg", avgRating: 4.5, ratingCount: 290, calories: 310, description: "Indo-Chinese style stir fried noodles" },
          { id: "sun-d2", name: "Chilli Paneer Dry / Gravy", type: "special", avgRating: 4.7, ratingCount: 340, calories: 290, description: "Paneer cubes tossed with peppers in tangy chilli sauce" },
          { id: "sun-d3", name: "Sweet Corn Soup", type: "veg", avgRating: 4.4, ratingCount: 210, calories: 140, description: "Warm comforting corn soup" },
          { id: "sun-d4", name: "Spring Rolls", type: "veg", avgRating: 4.3, ratingCount: 190, calories: 180, description: "Crispy stuffed vegetable rolls" },
          { id: "sun-d5", name: "Hot Chocolate Brownie", type: "special", avgRating: 4.9, ratingCount: 460, calories: 260, description: "Fudgy warm chocolate brownie dessert" },
        ],
      },
    ],
  },
];

export const mockFeedbacks = [
  {
    id: "fb-101",
    userName: "Rahul Sharma",
    userRole: "B.Tech CSE 3rd Year",
    dishId: "mon-l3",
    dishName: "Paneer Butter Masala",
    rating: 5,
    tags: ["Delicious", "Great Portion", "Perfect Seasoning"],
    comment: "Paneer was incredibly soft today! The gravies have improved significantly compared to last month. Kudos to the mess team!",
    date: "2026-08-28",
    mealType: "Lunch",
  },
  {
    id: "fb-102",
    userName: "Ananya Roy",
    userRole: "M.Tech Biotech",
    dishId: "mon-l2",
    dishName: "Dal Tadka",
    rating: 4,
    tags: ["Tasty", "Warm & Fresh"],
    comment: "Nice garlic aroma in the dal. Just could use a tad bit less oil.",
    date: "2026-08-28",
    mealType: "Lunch",
  },
  {
    id: "fb-103",
    userName: "Vikramaditya Singh",
    userRole: "MBA 1st Year",
    dishId: "mon-b1",
    dishName: "Indori Poha & Sev",
    rating: 3,
    tags: ["Too Salty", "Small Portion"],
    comment: "Poha salt was slightly high today, but the crunchy sev helped balance it.",
    date: "2026-08-28",
    mealType: "Breakfast",
  },
  {
    id: "fb-104",
    userName: "Priya Patel",
    userRole: "B.Des 2nd Year",
    dishId: "sat-b1",
    dishName: "Chole Bhature",
    rating: 5,
    tags: ["Chef Special", "Delicious", "Clean Presentation"],
    comment: "Best Saturday breakfast ever! Super fluffy bhaturas and authentic chole flavour.",
    date: "2026-08-26",
    mealType: "Breakfast",
  },
];

export const mockComplaints = [
  { id: "c1", category: "Food Quality", meal: "Lunch", description: "Dal was too salty today in section B counters", priority: "Normal", status: "Under Review", adminResponse: "Mess supervisor informed to adjust salt calibration.", createdAt: "2026-08-27" },
  { id: "c2", category: "Hygiene", meal: "Dinner", description: "Water dispenser near dining area counter 2 needs filter cleaning", priority: "Urgent", status: "In Progress", adminResponse: "Maintenance team scheduled for replacement.", createdAt: "2026-08-26" },
  { id: "c3", category: "Quantity", meal: "Breakfast", description: "Poha portions ran out early at 09:10 AM", priority: "Important", status: "Resolved", adminResponse: "Buffer batch preparation introduced for peak breakfast hours.", createdAt: "2026-08-24" },
];

export const mockSuggestions = [
  { id: "s1", foodName: "Masala Dosa", category: "South Indian", votes: 248, dislikes: 12, status: "Approved", description: "Crispy rice crepes with spicy potato mash & coconut chutneys." },
  { id: "s2", foodName: "Hyderabadi Chicken/Veg Biryani", category: "Rice", votes: 310, dislikes: 8, status: "Approved", description: "Fragrant saffron rice served with refreshing raita on weekends." },
  { id: "s3", foodName: "Chole Bhature", category: "North Indian", votes: 195, dislikes: 24, status: "Approved", description: "Authentic Punjabi chole with hot puffed bhaturas." },
  { id: "s4", foodName: "Pav Bhaji", category: "Street Food", votes: 168, dislikes: 15, status: "Under Review", description: "Rich butter mashed veggie curry served with soft toasted pav." },
  { id: "s5", foodName: "Cold Coffee Shake", category: "Beverage", votes: 142, dislikes: 9, status: "Under Review", description: "Thick creamy chilled coffee for hot afternoons." },
];

export const mockAdminKpis = {
  totalStudents: 640,
  todaysFeedback: 482,
  averageRating: 4.3,
  totalComplaints: 22,
  pendingComplaints: 4,
  popularFood: "Paneer Butter Masala",
  leastRatedFood: "Baingan Bharta",
  participationRate: 88,
};

export const mockFoodRatings = [
  { name: "Chole Bhature", avgRating: 4.9, count: 420 },
  { name: "Paneer Butter Masala", avgRating: 4.8, count: 310 },
  { name: "Aloo Paratha", avgRating: 4.8, count: 350 },
  { name: "Crispy Masala Dosa", avgRating: 4.7, count: 310 },
  { name: "Dal Makhani", avgRating: 4.7, count: 320 },
  { name: "Mix Veg Sabzi", avgRating: 3.8, count: 120 },
  { name: "Baingan Bharta", avgRating: 3.7, count: 110 },
];

// Compatibility exports
export const mockMenu = {
  date: new Date().toISOString().slice(0, 10),
  meals: initialWeeklyMenu[0].meals.map((m) => ({
    mealType: m.mealType,
    items: m.items.map((i) => ({ id: i.id, name: i.name, avgRating: i.avgRating })),
  })),
};

// State Persistence Helper Utilities for Local Storage

export function getStoredWeeklyMenu() {
  const stored = localStorage.getItem("messmate_weekly_menu");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading weekly menu from storage", e);
    }
  }
  return initialWeeklyMenu;
}

export function saveWeeklyMenu(menuData) {
  localStorage.setItem("messmate_weekly_menu", JSON.stringify(menuData));
}

export function getStoredFeedbacks() {
  const stored = localStorage.getItem("messmate_feedbacks");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading feedbacks", e);
    }
  }
  return mockFeedbacks;
}

export function saveFeedbacks(feedbacks) {
  localStorage.setItem("messmate_feedbacks", JSON.stringify(feedbacks));
}
