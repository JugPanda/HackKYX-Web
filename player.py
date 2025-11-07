"""
Player class for the 2D platformer
"""

import pygame

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        
        # Player dimensions (16-bit style: small and pixelated)
        self.width = 32
        self.height = 32
        
        # Create a simple 16-bit style sprite
        self.image = pygame.Surface((self.width, self.height))
        self.image.fill((0, 128, 255))  # Blue color for player
        # Draw simple face (16-bit style)
        pygame.draw.circle(self.image, (255, 255, 0), (10, 12), 3)  # Left eye
        pygame.draw.circle(self.image, (0, 0, 0), (10, 12), 1)  # Left eye pupil
        pygame.draw.circle(self.image, (255, 255, 0), (22, 12), 3)  # Right eye
        pygame.draw.circle(self.image, (0, 0, 0), (22, 12), 1)  # Right eye pupil
        # Simple mouth
        pygame.draw.arc(self.image, (0, 0, 0), (8, 18, 16, 8), 0, 3.14, 2)
        
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        
        # Physics
        self.velocity_x = 0
        self.velocity_y = 0
        self.speed = 5
        self.jump_strength = -15
        self.gravity = 0.8
        self.on_ground = False
        
    def update(self, keys, platforms):
        """Update player position and physics"""
        # Handle horizontal movement
        self.velocity_x = 0
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.velocity_x = -self.speed
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.velocity_x = self.speed
        
        # Apply gravity
        self.velocity_y += self.gravity
        
        # Update position
        self.rect.x += self.velocity_x
        self.check_horizontal_collisions(platforms)
        
        self.rect.y += self.velocity_y
        self.on_ground = False
        self.check_vertical_collisions(platforms)
        
        # Limit fall speed
        if self.velocity_y > 20:
            self.velocity_y = 20
    
    def check_horizontal_collisions(self, platforms):
        """Check and handle horizontal collisions"""
        for platform in platforms:
            if self.rect.colliderect(platform.rect):
                if self.velocity_x > 0:  # Moving right
                    self.rect.right = platform.rect.left
                elif self.velocity_x < 0:  # Moving left
                    self.rect.left = platform.rect.right
    
    def check_vertical_collisions(self, platforms):
        """Check and handle vertical collisions"""
        for platform in platforms:
            if self.rect.colliderect(platform.rect):
                if self.velocity_y > 0:  # Falling
                    self.rect.bottom = platform.rect.top
                    self.velocity_y = 0
                    self.on_ground = True
                elif self.velocity_y < 0:  # Jumping
                    self.rect.top = platform.rect.bottom
                    self.velocity_y = 0
    
    def jump(self):
        """Make the player jump"""
        if self.on_ground:
            self.velocity_y = self.jump_strength
            self.on_ground = False

