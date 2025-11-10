"""
Simple Pygame Test Game - Guaranteed to work!
A square you can move around with WASD
"""
import asyncio
import pygame

# Constants
WIDTH, HEIGHT = 800, 600
PLAYER_SIZE = 50  # Made bigger so it's easy to see!
PLAYER_SPEED = 5

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 100, 255)

async def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Test Game - Move with WASD")
    clock = pygame.time.Clock()
    
    # Player starts in center
    player_x = WIDTH // 2
    player_y = HEIGHT // 2
    
    # Font for instructions
    font = pygame.font.Font(None, 36)
    
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        
        # Get keys
        keys = pygame.key.get_pressed()
        
        # Move player
        if keys[pygame.K_w] or keys[pygame.K_UP]:
            player_y -= PLAYER_SPEED
        if keys[pygame.K_s] or keys[pygame.K_DOWN]:
            player_y += PLAYER_SPEED
        if keys[pygame.K_a] or keys[pygame.K_LEFT]:
            player_x -= PLAYER_SPEED
        if keys[pygame.K_d] or keys[pygame.K_RIGHT]:
            player_x += PLAYER_SPEED
        
        # Keep player on screen
        player_x = max(0, min(WIDTH - PLAYER_SIZE, player_x))
        player_y = max(0, min(HEIGHT - PLAYER_SIZE, player_y))
        
        # Draw everything
        screen.fill(BLACK)  # Black background
        
        # Draw instructions
        text = font.render("Use WASD or Arrow Keys to Move!", True, WHITE)
        screen.blit(text, (150, 50))
        
        # Draw player as a BIG RED SQUARE
        pygame.draw.rect(screen, RED, (player_x, player_y, PLAYER_SIZE, PLAYER_SIZE))
        
        # Draw a goal area (green square in bottom right)
        goal_size = 80
        goal_x = WIDTH - goal_size - 50
        goal_y = HEIGHT - goal_size - 50
        pygame.draw.rect(screen, GREEN, (goal_x, goal_y, goal_size, goal_size))
        
        # Draw goal text
        goal_text = font.render("GOAL", True, BLACK)
        screen.blit(goal_text, (goal_x + 10, goal_y + 25))
        
        # Check if player reached goal
        player_rect = pygame.Rect(player_x, player_y, PLAYER_SIZE, PLAYER_SIZE)
        goal_rect = pygame.Rect(goal_x, goal_y, goal_size, goal_size)
        
        if player_rect.colliderect(goal_rect):
            # Win screen
            win_text = font.render("YOU WIN! Press R to restart", True, BLUE)
            screen.blit(win_text, (200, HEIGHT // 2))
            
            if keys[pygame.K_r]:
                player_x = WIDTH // 2
                player_y = HEIGHT // 2
        
        pygame.display.flip()
        clock.tick(60)
        
        # Critical for pygbag!
        await asyncio.sleep(0)
    
    pygame.quit()

# This is required for pygbag
if __name__ == "__main__":
    asyncio.run(main())

