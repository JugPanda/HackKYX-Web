"""
2D 16-bit Platformer Game
Built with Python and Pygame
Web-compatible with pygbag
"""

import pygame
import sys
import asyncio
from player import Player
from platform import Platform
from camera import Camera

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 1024
SCREEN_HEIGHT = 768
FPS = 60

# Colors (16-bit inspired palette)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GRAY = (128, 128, 128)
DARK_GRAY = (64, 64, 64)
BROWN = (139, 69, 19)
GREEN = (0, 128, 0)
BLUE = (0, 0, 255)
RED = (255, 0, 0)
SKY_BLUE = (135, 206, 235)

class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("16-bit Platformer")
        self.clock = pygame.time.Clock()
        self.running = True
        
        # Create camera
        self.camera = Camera(SCREEN_WIDTH, SCREEN_HEIGHT)
        
        # Create player
        self.player = Player(100, 100)
        
        # Create platforms
        self.platforms = pygame.sprite.Group()
        self.create_level()
        
        # All sprites group
        self.all_sprites = pygame.sprite.Group()
        self.all_sprites.add(self.player)
        self.all_sprites.add(self.platforms)
        
    def create_level(self):
        """Create the level with platforms"""
        # Ground platforms
        ground_height = 50
        ground_y = SCREEN_HEIGHT - ground_height
        
        # Main ground
        self.platforms.add(Platform(0, ground_y, SCREEN_WIDTH, ground_height, BROWN))
        
        # Floating platforms
        self.platforms.add(Platform(300, ground_y - 150, 200, 30, BROWN))
        self.platforms.add(Platform(600, ground_y - 250, 200, 30, BROWN))
        self.platforms.add(Platform(900, ground_y - 350, 200, 30, BROWN))
        self.platforms.add(Platform(1200, ground_y - 200, 200, 30, BROWN))
        self.platforms.add(Platform(1500, ground_y - 300, 200, 30, BROWN))
        
        # Wall platforms
        self.platforms.add(Platform(2000, ground_y - 400, 30, 400, BROWN))
        
    def handle_events(self):
        """Handle game events"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.running = False
                elif event.key == pygame.K_SPACE:
                    self.player.jump()
    
    def update(self):
        """Update game state"""
        keys = pygame.key.get_pressed()
        self.player.update(keys, self.platforms)
        
        # Update camera to follow player
        self.camera.update(self.player)
        
    def draw(self):
        """Draw everything"""
        # Clear screen with sky color
        self.screen.fill(SKY_BLUE)
        
        # Draw all sprites with camera offset
        for sprite in self.all_sprites:
            self.screen.blit(sprite.image, self.camera.apply(sprite))
        
        # Draw UI (not affected by camera)
        self.draw_ui()
        
        pygame.display.flip()
    
    def draw_ui(self):
        """Draw UI elements"""
        font = pygame.font.Font(None, 36)
        # You can add UI elements here like health, score, etc.
    
    async def run(self):
        """Main game loop (async for web compatibility)"""
        while self.running:
            self.handle_events()
            self.update()
            self.draw()
            await asyncio.sleep(0)  # Allow other tasks to run (required for web)
            self.clock.tick(FPS)
        
        pygame.quit()
        if sys.platform != 'emscripten':
            sys.exit()

async def main():
    """Main entry point for web compatibility"""
    game = Game()
    await game.run()

if __name__ == "__main__":
    asyncio.run(main())

