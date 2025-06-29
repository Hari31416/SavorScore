# SavorScore: Dish Judgment Tracker

## Project Overview: Dish Judgment Tracker (MERN Stack)

**Application Goal:** To provide a user-friendly web interface for a user (you) to record, view, edit, and potentially analyze judgments of dishes from various restaurants using a set of defined metrics, with improved data integrity and analytical capabilities.

**Technology Stack (Same):** MongoDB, Express.js, React.js, Node.js.

---

**Phase 1: Planning & Design (The "Why" and "What")**

1.  **Define Core Features (MVP - Minimum Viable Product):**

    - **User Authentication (Recommended):** User registration/login.
    - **Restaurant CRUD:**
      - Create/Read/Update/Delete restaurants (Name, Address, Cuisine Type).
    - **Dish CRUD:**
      - Create/Read/Update/Delete dishes (Name, Description, _can optionally link to a default restaurant if a dish is exclusive, but generally dishes are independent and linked via judgment_).
    - **Dish Judgment CRUD:**
      - **Create:** Form to add a new dish judgment. This form will now allow you to **select an existing Restaurant** and **select an existing Dish** from dropdowns (or create new ones on the fly). Metrics, Date, Notes.
      - **Read:**
        - List all judgments (filterable/sortable).
        - Detailed view for a single judgment, showing linked restaurant and dish details.
        - Views to list all Restaurants, and all Dishes.
      - **Update/Delete:** Edit/remove judgments.

2.  **Revised Database Schema Design (MongoDB):**

    - **`User` Collection (if implementing auth):**

      - `_id: ObjectId`
      - `username: String (unique)`
      - `password: String` (hashed)
      - `email: String` (optional)
      - `createdAt: Date`, `updatedAt: Date`

    - **`Restaurant` Collection:**

      - `_id: ObjectId`
      - `name: String (unique)`
      - `address: String` (Optional)
      - `cuisineType: String` (e.g., "Italian", "Mexican", "Fusion") (Optional)
      - `phone: String` (Optional)
      - `website: String` (Optional)
      - `user: ObjectId` (Reference to `User`, if multi-user or for ownership)
      - `createdAt: Date`, `updatedAt: Date`

    - **`Dish` Collection:**

      - `_id: ObjectId`
      - `name: String`
      - `description: String` (Optional)
      - `category: String` (e.g., "Appetizer", "Main Course", "Dessert", "Beverage") (Optional)
      - `user: ObjectId` (Reference to `User`, if multi-user or for ownership)
      - `createdAt: Date`, `updatedAt: Date`
      - _(Note: A dish name like "Margherita Pizza" can exist across multiple restaurants. The specific instance you judge is tied via `DishJudgment`.)_

    - **`DishJudgment` Collection:**
      - `_id: ObjectId`
      - `dish: ObjectId` (Reference to `Dish` collection)
      - `restaurant: ObjectId` (Reference to `Restaurant` collection)
      - `date: Date`
      - `overallFlavorExperience: Number` (1-10)
      - `ingredientQuality: Number` (1-5)
      - `textureMouthfeel: Number` (1-5)
      - `executionCraftsmanship: Number` (1-5)
      - `valueForMoney: Number` (1-5)
      - `cravingReorderLikelihood: Number` (1-10)
      - `notes: String` (Optional, multi-line text)
      - `user: ObjectId` (Reference to `User`, if multi-user or for ownership)
      - `createdAt: Date`, `updatedAt: Date`

3.  **Revised API Endpoint Design (RESTful Principles):**

    - `/api/auth/register`, `/api/auth/login`
    - `/api/restaurants` (GET, POST)
    - `/api/restaurants/:id` (GET, PUT, DELETE)
    - `/api/dishes` (GET, POST)
    - `/api/dishes/:id` (GET, PUT, DELETE)
    - `/api/judgments` (GET, POST)
    - `/api/judgments/:id` (GET, PUT, DELETE)
      - _For GET requests, you'll need to "populate" the `dish` and `restaurant` fields to get their details._

4.  **UI/UX Sketching (React):**

    - **New Pages/Components:**
      - `RestaurantsPage` (List of Restaurants, Add/Edit Restaurant forms)
      - `DishesPage` (List of Dishes, Add/Edit Dish forms)
    - **Revised Add/Edit Judgment Form:**
      - Now includes dropdowns to select existing `Restaurant` and `Dish` records. Need error handling if no restaurants or dishes exist yet. Consider an inline "Add New Restaurant" or "Add New Dish" button within the judgment form for convenience.
    - **Display:** Judgment list/detail view will now show linked restaurant and dish names, possibly with links to their respective detail pages.

---

**Phase 2: Backend Development (Node.js & Express.js with MongoDB)**

1.  **Project Setup (Same).**
2.  **Database Connection (Same).**
3.  **Models (Mongoose Schemas):**

    - Create `User.js`, `Restaurant.js`, `Dish.js`, and `DishJudgment.js` models.
    - Crucially, in `DishJudgment.js`, use `mongoose.Schema.Types.ObjectId` for `dish` and `restaurant` fields, and add `ref: 'Dish'` and `ref: 'Restaurant'` respectively for population.

4.  **API Routes & Controllers:**

    - Create separate route and controller files for `restaurants`, `dishes`, and `judgments` (and `auth`).
    - **Key Consideration:** When fetching `DishJudgment` records, use Mongoose's `.populate('dish')` and `.populate('restaurant')` methods to embed the linked `Dish` and `Restaurant` documents' data directly into the judgment response. This avoids N+1 query problems on the frontend.
    - Implement CRUD logic for each model, ensuring proper validation and error handling.

5.  **Authentication Middleware (If Implemented):** Secure all relevant CRUD operations.

6.  **Server Setup (Same).**

---

**Phase 3: Frontend Development (React.js)**

1.  **Project Setup (Same).**
2.  **Component Structure:**

    - Integrate the new `RestaurantsPage` and `DishesPage`.
    - Update `AddJudgmentPage` and `EditJudgmentPage` to fetch lists of existing restaurants and dishes from the backend to populate dropdowns.
    - Ensure `JudgmentCard` and `JudgmentDetailPage` can display the details from the populated `dish` and `restaurant` objects.

3.  **Routing (Same, with new routes for restaurants and dishes).**

4.  **State Management:**

    - You'll now have more data to manage: list of judgments, list of restaurants, list of dishes.
    - Consider fetching these lists once and storing them in a shared context or higher-level component to avoid refetching.

5.  **API Integration:**

    - New `axios` calls for `/api/restaurants` and `/api/dishes`.
    - Ensure judgment fetch calls correctly handle the populated data.

6.  **Forms:**

    - Develop forms for adding/editing restaurants and dishes.
    - Modify the judgment form to use select elements for linking to existing restaurant/dish records.

7.  **Styling (Same).**

---

**Phase 4: Deployment & Iteration (Same, with enriched analysis capabilities)**

- **Future Enhancements (Now even more powerful):**
  - **Restaurant-Specific Analysis:** What's the average "Overall Flavor" score for _Restaurant X_? Which are its top-rated dishes?
  - **Dish-Specific Analysis:** What's the average "Craving Factor" for "Pizza" across all restaurants you've tried?
  - **Comparison:** Compare the "Execution & Craftsmanship" of "Burger" at _Restaurant A_ vs. _Restaurant B_.
  - More sophisticated data visualizations that leverage the relationships between judgments, dishes, and restaurants.

This revised approach sets you up for a much more powerful and useful application in the long run. Good call on normalizing the data!
