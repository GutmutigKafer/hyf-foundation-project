CREATE TABLE IF NOT EXISTS images(
  img_id INTEGER PRIMARY KEY AUTOINCREMENT,
  type varchar(255) NOT NULL,
  pic varchar(255) NOT NULL
);

INSERT INTO images (id, name, url) VALUES  
(1, 'mouse', 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400'),  
(2, 'grey_cat', 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400'),  
(3, 'human', 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400'),  
(4, 'sitting_cat', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400'),  
(5, 'looking_cat', 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400'),  
(6, 'angry_cat', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400'),  
(7, 'cute_dog', 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400'),  
(8, 'yellow-dog', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400'),  
(9, 'beach', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'),  
(10, 'scenery', 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=400'),  
(11, 'people_at_beach', 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=400'),  
(12, 'boat', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400'); 



CREATE TABLE game_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    cards_revealed INTEGER NOT NULL,
    time_taken INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
