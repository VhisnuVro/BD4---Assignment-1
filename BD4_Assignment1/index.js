const express = require('express');
const { resolve } = require('path');
let cors = require('cors');
let sqlite3 = require('sqlite3');
let { open } = require('sqlite');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

// Initializing the db
let db;
(async () => {
  try {
    db = await open({
      filename: './BD4_Assignment1/database.sqlite',
      driver: sqlite3.Database,
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Error opening database: ', error);
  }
})();

const ensureDbReady = (req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: 'Database not initialized yet' });
  }
  next();
};

//Exercise 1: Fetch Kitchen Items by Minimum Rating
const getAllRestaurants = async () => {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
};

app.get('/restaurants', async (req, res) => {
  try {
    let results = await getAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants found' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 2: Get Restaurant by ID
const getRestaurantById = async (id) => {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.get(query, [id]);
  return { restaurants: response };
};

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let results = await getRestaurantById(id);

    if (!results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants found' });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 3: Get Restaurants by Cuisine
const getRestaurantByCuisine = async (cuisine) => {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.get(query, [cuisine]);
  return { restaurants: response };
};

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let results = await getRestaurantByCuisine(cuisine);

    if (!results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurant found' });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 4: Get Restaurants by Filter
const getRestaurantFilter = async (isVeg, hasOutdoorSeating, isLuxury) => {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
};

app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let results = await getRestaurantFilter(isVeg, hasOutdoorSeating, isLuxury);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurant found' });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 5: Get Restaurants Sorted by Rating
const getRestaurantSorted = async () => {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
};

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await getRestaurantSorted();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurant found' });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 6: Get All Dishes
const getDishes = async () => {
  let query = 'SELECT * FROM dishes ';
  let response = await db.all(query, []);
  return { dishes: response };
};

app.get('/dishes', async (req, res) => {
  try {
    let results = await getDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 7: Get Dish by ID
const getDishesById = async (id) => {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);
  return { dishes: response };
};

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let results = await getDishesById(id);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 8: Get Dishes by Filter
const getDishesByisVeg = async (isVeg) => {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
};

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let results = await getDishesByisVeg(isVeg);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Exercise 9: Get Dishes Sorted by Price
const getDishesSortedByPrice = async () => {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
};

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await getDishesSortedByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
