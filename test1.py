text="""
TV Shows:
1. Game of Thrones
2. Breaking Bad
3. Friends
4. The Big Bang Theory
5. Stranger Things
6. The Walking Dead
7. The Simpsons
8. Sherlock
9. Peaky Blinders
10. The Crown
11. The Office
12. Black Mirror
13. Narcos
14. The Haunting of Hill House
15. Westworld

Movies:
1. The Godfather
2. The Shawshank Redemption
3. The Lord of the Rings: The Return of the King
4. The Dark Knight
5. Inception
6. Pulp Fiction
7. Fight Club
8. Forrest Gump
9. The Matrix
10. Goodfellas
11. Seven Samurai
12. Schindler's List
13. Jurassic Park
14. The Silence of the Lambs
15. Star Wars: The Empire Strikes Back

Songs:
1. "Funky Tech House Mix 2019" - Nala Sinephro
2. "Space 1.8" - Nala Sinephro
3. "Space 3" - Nala Sinephro
4. "Comfortably Numb" - Pink Floyd
5. "Squeezehouse" - The Wall
6. "Guitar Hero" - Maximillion
7. "Shred" - Ripping Solo
8. "Us and Them" - Pink Floyd
9. "Brain Damage" - Pink Floyd
10. "Money" - Pink Floyd
11. "Time" - Pink Floyd
12. "Wish You Were Here" - Pink Floyd
13. "Learning to Fly" - Pink Floyd
14. "Hey You" - Pink Floyd
15. "Run Like Hell" - Pink Floyd
"""

sections=text.split("\n\n")

sections=[section.strip() for section in sections]

shows=[]
movies=[]
songs=[]

for section in sections:
    lines = section.split('\n')
    category = lines.pop(0).replace(':', '')
    for line in lines:
        if category == 'TV Shows':
            shows.append(line.strip().split('. ')[1])
        elif category == 'Movies':
            movies.append(line.strip().split('. ')[1])
        elif category == 'Songs':
            songs.append(line.strip().split('. ')[1])

print('TV Shows:', shows)
print('Movies:', movies)
print('Songs:', songs)



