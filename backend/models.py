# -*- coding: utf-8 -*-
from config import db

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    ingredients = db.Column(db.String(255))
    preparation = db.Column(db.String(255))
    time=db.Column(db.Integer)
    difficulty=db.Column(db.Integer)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'ingredients': self.ingredients,
            'preparation': self.preparation,
            'time': self.time,
            'difficulty': self.difficulty
        }