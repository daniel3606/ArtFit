from marketplace.models import SkillTag
seed = [
    ("UI/UX","ROLE"),("Front-end","ROLE"),("Back-end","ROLE"),
    ("Figma","TOOL"),("Vue.js","TOOL"),("React","TOOL"),("Django","TOOL"),("PostgreSQL","TOOL"),
    ("Minimalist","STYLE"),("Playful","STYLE"),
    ("Game UI","GENRE"),("Web App","GENRE"),
]
for name, kind in seed:
    SkillTag.objects.get_or_create(name=name, kind=kind)
print("Seeded skills.")
