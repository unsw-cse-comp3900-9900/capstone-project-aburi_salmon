class menu_DB:

    def __init__(self, db):
        self.db = db

    # Get a list of all the categories in the menu
    def get_categories(self):
        rows = self.db.query('SELECT * FROM category ORDER BY position')
        if (not rows):
            return None
        
        return [{
            'id': row[0],
            'name': row[1],
            'position': row[2]
        } for row in rows]
    
    # Given an id, get the associated cateogry and a list items that belong to that category
    def get_category(self, id):
        rows = self.db.query('SELECT * FROM category WHERE id = %s', [id])

        if (not rows or not rows[0]):
            return
        
        category = {
            'id': id,
            'name': rows[0][1],
            'position': rows[0][2],
            'items': self.get_items_by_category(id)
        }

        return category
    
    # Given a category id, return a list of items (and their ingredients) in the category 
    def get_items_by_category(self, category_id):
        rows = self.db.query(
            'SELECT id, name, description, price, visible, image_url, time FROM item i JOIN category_item ci on (i.id = ci.item_id) WHERE ci.category_id = %s',
            [category_id]
        )

        if (not rows):
            return []
        
        return [{
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'price': row[3],
            'visible': row[4],
            'image_url': row[5],
            'time': row[6],
            'ingredients': self.get_item_ingredients(row[0])
        } for row in rows]
    
    # Given an item id, return a list of ingredients that make up the item
    def get_item_ingredients(self, id):
        rows = self.db.query(
            'SELECT * FROM ingredient i JOIN item_ingredient ii on (i.id = ii.ingredient_id) WHERE ii.item_id = %s',
            [id]
        )
        
        if (not rows):
            return []

        return [{
            'id': row[0],
            'name': row[1]
        } for row in rows]

    # Insert a new item into the database and return the item id
    def create_item(self, item):
        image_url = item.get('image_url')

        if image_url is None:
            image_url = ""

        rows = self.db.query(
            'INSERT INTO item (name, description, price, visible, image_url) VALUES (%s, %s, %s, %s, %s) RETURNING id',
            [item.get('name'), item.get('description'), item.get('price'), item.get('visible'), image_url]
        )
        if not rows or not rows[0]:
            return None

        return rows[0][0]

    # Return a list of all the items in the menu and their ingredients
    def get_all_menu_items(self):
        rows = self.db.query(
            'SELECT id, name, description, price, visible, image_url FROM item'
        )
        if (not rows):
            return []

        return [{
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'price': row[3],
            'visible': row[4],
            'image_url': row[5],
            'ingredients': self.get_item_ingredients(row[0])
        } for row in rows]

    # Update an item in the menu
    def edit_item(self, edit, item_id):
        editArr = []
        editStatement = 'UPDATE item SET '
        if (edit.get('name')):
            editStatement += "name = %s, "
            editArr.append(edit.get('name'))
        if (edit.get('description')):
            editStatement += "description = %s, "
            editArr.append(edit.get('description'))
        if (edit.get('price')):
            editStatement += "price = %s, "
            editArr.append(edit.get('price'))
        if (edit.get('visible')):
            editStatement += "visible = %s, "
            editArr.append(edit.get('visible'))
        if (edit.get('image_url')):
            editStatement += "image_url = %s, "
            editArr.append(edit.get('image_url'))

        editStatement = editStatement.strip(', ') + ' WHERE id = %s'
        editArr.append(item_id)
        return self.db.update(editStatement, editArr)

    # Get a menu item given its id
    def get_item_by_id(self, id):
        rows = self.db.query('SELECT id, name, description, price, visible, image_url FROM item WHERE id = %s', [id])
        if (not rows):
            return None
        
        itemRow = rows[0]
        return {
            'id': itemRow[0],
            'name': itemRow[1],
            'description': itemRow[2],
            'price': itemRow[3],
            'visible': itemRow[4],
            'image_url': itemRow[5],
            'ingredients': self.get_item_ingredients(id)
        }

    # Delete an item from the menu
    def delete_item(self, id):
        return (
            self.db.delete('DELETE FROM category_item WHERE item_id = %s', [id]) and
            self.db.delete('DELETE FROM item_ingredient WHERE item_id = %s', [id]) and
            self.db.delete("DELETE FROM item WHERE id = %s", [id])
        )

    # Create a new menu cateogry
    def create_category(self, name):
        # Set the postion to the current highest position + 1 
        rows = self.db.query('SELECT max(position) FROM category')
        position = rows[0][0] + 1

        self.db.insert(
            'INSERT INTO category (name, position) VALUES (%s, %s)',
            [name, position]
        )

        return True
    
    # Update a category in the menu
    def edit_category(self, edit, category_id):
        editArr = []
        editStatement = 'UPDATE category SET '

        if (edit.get('name')):
            editStatement += "name = %s, "
            editArr.append(edit.get('name'))
        else:
            abort(400, 'Missing required field \'name\'')

        editStatement = editStatement.strip(', ') + ' WHERE id = %s'
        editArr.append(category_id)
        return self.db.update(editStatement, editArr)

    # Delete a category from the menu
    def delete_category(self, id):
        self.db.delete('DELETE FROM category_item WHERE category_id = %s', [id])
        return self.db.delete('DELETE FROM category WHERE id = %s', [id])

    # Swap the position of 2 categories in the menu
    def swapCategoryPositions(self, id1, id2):
        print('Swapping categories {} and {}'.format(id1, id2))
        # Get positions
        rows = self.db.query('SELECT position FROM category WHERE id in (%s, %s) ORDER BY id', [id1, id2])
        position1 = rows[0][0]
        position2 = rows[1][0]

        # Update position 1 and position 2
        return (
            self.db.update('UPDATE category SET position = %s WHERE id = %s', [0, id1]) and
            self.db.update('UPDATE category SET position = %s WHERE id = %s', [position1, id2]) and
            self.db.update('UPDATE category SET position = %s WHERE id = %s', [position2, id1])
        )

    # Add an item to a category (creates a record in category_item table)
    def add_item_to_category(self, category_id, item_id):
        # Check if the item not in category already
        rows = self.db.query(
            'SELECT * FROM category_item WHERE category_id = %s AND item_id = %s',
            [category_id, item_id]
        )
        
        if (rows != None):
            # Item already in category
            return False

        # Add item to category
        self.db.insert(
            'INSERT INTO category_item (item_id, category_id) VALUES (%s, %s)',
            [item_id, category_id]
        )
        return True

    # Remove an item from a category (delete record from category_item table)
    def remove_item_from_category(self, category_id, item_id):
        return self.db.delete(
            'DELETE FROM category_item WHERE category_id = %s AND item_id = %s',
            [category_id, item_id]
        )

    # Return a list of all ingredients in the menu
    def get_all_ingredients(self):
        rows = self.db.query('SELECT * FROM ingredient')
        if (not rows):
            return []
        
        return [{
            'id': row[0],
            'name': row[1]
        } for row in rows]

    # Create a new menu ingredient
    def create_ingredient(self, name):
        self.db.insert(
            'INSERT INTO ingredient (name) VALUES (%s)',
            [name]
        )
        return True

    # Get a menu ingredient given its id
    def get_ingredient_by_id(self, id):
        rows = self.db.query(
            'SELECT * FROM ingredient WHERE id = %s',
            [id]
        )

        if (not rows or not rows[0]):
            return None

        ingredient = rows[0]
        return {
            'id': ingredient[0],
            'name': ingredient[1]
        }

    # Update an ingredient on the menu
    def edit_ingredient(self, name, ingredient_id):
        editStatement = 'UPDATE ingredient SET name = %s WHERE id = %s'
        editArr = [name, ingredient_id]
        self.db.update(editStatement, editArr)
        return True

    # Delete an ingredient from the menu
    def delete_ingredient(self, id):
        # Only delete if no items contain the ingredient
        rows = self.db.query(
            'SELECT count(item_id) FROM item_ingredient WHERE ingredient_id = %s',
            [id]
        )
        if (rows[0][0]):
            return False
        
        return self.db.delete(
            'DELETE FROM ingredient WHERE id = %s',
            [id]
        )

    # Add an ingredient to an item (creates a record in the item_ingredient table)
    def add_ingredient_to_item(self, item_id, ingredient_id):
        self.db.insert(
            'INSERT INTO item_ingredient (item_id, ingredient_id) VALUES (%s, %s)',
            [item_id, ingredient_id]
        )

        return True

    # Remove ingredient from an item (removes record from item_ingredient table)
    def remove_ingredient_from_item(self, item_id, ingredient_id):
        return self.db.delete(
            'DELETE FROM item_ingredient WHERE item_id = %s AND ingredient_id = %s',
            [item_id, ingredient_id]
        )

    