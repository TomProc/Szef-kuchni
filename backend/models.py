# -*- coding: utf-8 -*-
from config import db

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    ingredients = db.Column(db.String(255))
    time=db.Column(db.Integer)
    difficulty=db.Column(db.Integer)
    preparation = db.Column(db.String(255))
    favourite=db.Column(db.Boolean, default=False)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'ingredients': self.ingredients,
            'time': self.time,
            'difficulty': self.difficulty,
            'preparation': self.preparation,
            'favourite': self.favourite
        }