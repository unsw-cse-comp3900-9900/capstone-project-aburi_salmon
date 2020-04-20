class stats_DB:

    def __init__(self, db):
        self.db = db

    def get_menu_item_sales(self, item_id = None):
        if item_id is None:
            rows = self.db.query(
                'SELECT i.id, i.name, i.price, sum(io.quantity) FROM item i JOIN item_order io on (i.id = io.item_id) GROUP BY i.id'
            )
        else:
            rows = self.db.query(
                'SELECT i.id, i.name, i.price, sum(io.quantity) FROM item i JOIN item_order io on (i.id = io.item_id) WHERE i.id = %s GROUP BY i.id',
                [item_id]
            )

        if (not rows):
            return []

        return [{
            'id': row[0],
            'name': row[1],
            'price': row[2],
            'orders': row[3],
            'revenue': row[2] * row[3]
        } for row in rows]

    def get_category_sales(self):
        rows = self.db.query(
            '''
            SELECT c.id, c.name, sum(io.quantity), sum(io.quantity * i.price) as revenue
            FROM item i JOIN item_order io on (i.id = io.item_id)
                        JOIN category_item ci on (ci.item_id = i.id)
                        JOIN category c on (c.id = ci.category_id)
            GROUP BY c.id
            '''
        )

        if (not rows):
            return []

        return [{
            'id': row[0],
            'name': row[1],
            'orders': row[2],
            'revenue': row[3]
        } for row in rows]

    def get_recommendation(self, items=[]):
        # Orders where item appears
        rows = self.db.query(
            'SELECT distinct o.id FROM item i JOIN item_order io on (i.id = io.item_id) JOIN "order" o on (o.id = io.order_id) WHERE i.id in %s',
            [tuple(i for i in items)]
        )

        if (not rows or not rows[0]):
            return None

        orders = tuple(row[0] for row in rows)

        # Get count of other items in these orders
        rows = self.db.query(
            'SELECT distinct i.id, i.name, count(i.id) as seen FROM item i JOIN item_order io on (i.id = io.item_id) JOIN "order" o on (o.id = io.order_id) WHERE i.id not in %s AND o.id in %s GROUP BY i.id ORDER BY seen DESC',
            [tuple(i for i in items), orders]
        )

        # Return top 3 recommendations
        return [{
            'item_id': row[0],
            'name': row[1],
            'count': row[2]
        } for row in rows][:3]