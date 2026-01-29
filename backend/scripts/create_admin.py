"""
Create an admin user for MentalTech Discover.

Usage:
    docker compose exec backend python -m scripts.create_admin

Or locally:
    cd backend && python -m scripts.create_admin
"""

import sys
import os

# Add the parent directory to sys.path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.user import User
from app.services.auth import hash_password


def create_admin():
    db = SessionLocal()
    try:
        email = "admin@mentaltech.fr"
        existing = db.query(User).filter(User.email == email).first()

        if existing:
            print(f"L'utilisateur {email} existe déjà.")
            if existing.role != "admin":
                existing.role = "admin"
                db.commit()
                print("Rôle mis à jour vers admin.")
            else:
                print("Il est déjà admin.")
            return

        user = User(
            email=email,
            password_hash=hash_password("changeme123"),
            name="Admin MentalTech",
            role="admin",
        )
        db.add(user)
        db.commit()
        print(f"Admin créé : {email} / changeme123")
        print("IMPORTANT : Changez le mot de passe après la première connexion !")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
