"""
Camera class for following the player
"""

import pygame

class Camera:
    def __init__(self, width, height):
        self.camera = pygame.Rect(0, 0, width, height)
        self.width = width
        self.height = height
    
    def apply(self, entity):
        """Apply camera offset to entity"""
        return entity.rect.move(self.camera.topleft)
    
    def update(self, target):
        """Update camera to follow target"""
        # Center camera on target
        x = -target.rect.centerx + int(self.width / 2)
        y = -target.rect.centery + int(self.height / 2)
        
        # Limit camera scrolling (optional - can be removed for infinite scrolling)
        # x = min(0, x)  # Don't scroll left past start
        # y = min(0, y)  # Don't scroll up past top
        
        self.camera = pygame.Rect(x, y, self.width, self.height)

