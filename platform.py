"""
Platform class for the 2D platformer
"""

import pygame

class Platform(pygame.sprite.Sprite):
    def __init__(self, x, y, width, height, color):
        super().__init__()
        
        self.image = pygame.Surface((width, height))
        self.image.fill(color)
        
        # Add some 16-bit style detail (simple pattern)
        # Draw a border
        pygame.draw.rect(self.image, (color[0] - 30, color[1] - 30, color[2] - 30), 
                        (0, 0, width, height), 2)
        
        # Add some texture lines for 16-bit feel
        for i in range(0, width, 8):
            pygame.draw.line(self.image, 
                           (color[0] - 20, color[1] - 20, color[2] - 20),
                           (i, 0), (i, height), 1)
        
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y

