/**
 * Validates tournament registration data
 * @param data Registration data to validate
 * @returns Error message if validation fails, null if validation passes
 */
export function validateRegistration(data: any): string | null {
  console.log('Validating registration data:', data);
  
  // Check for required fields
  if (!data.tournamentId) return 'Tournament ID is required';
  if (!data.userId) return 'User ID is required';
  if (!data.teamName) return 'Team name is required';
  
  // Validate team name length
  if (data.teamName.length < 3) return 'Team name must be at least 3 characters';
  if (data.teamName.length > 50) return 'Team name cannot exceed 50 characters';
  
  // Validate team members
  if (!data.teamMembers || !Array.isArray(data.teamMembers)) {
    return 'Team members must be an array';
  }
  
  if (data.teamMembers.length === 0) {
    return 'At least one team member is required';
  }
  
  // Validate each team member has required fields
  for (let i = 0; i < data.teamMembers.length; i++) {
    const member = data.teamMembers[i];
    if (!member || typeof member !== 'object') {
      return `Team member ${i+1} is invalid`;
    }
    
    if (!member.name || typeof member.name !== 'string' || member.name.trim() === '') {
      return `Team member ${i+1} name is required`;
    }
    
    if (!member.email || typeof member.email !== 'string' || member.email.trim() === '') {
      return `Team member ${i+1} email is required`;
    }
    
    if (!member.gameId || typeof member.gameId !== 'string' || member.gameId.trim() === '') {
      return `Team member ${i+1} game ID is required`;
    }
  }
  
  // Validate captain info
  if (!data.captain) return 'Captain information is required';
  if (!data.captain.name) return 'Captain name is required';
  if (!data.captain.email) return 'Captain email is required';
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.captain.email)) {
    return 'Invalid captain email format';
  }
  
  // Validate contact info
  if (!data.contactInfo) return 'Contact information is required';
  if (!data.contactInfo.email) return 'Contact email is required';
  if (!emailRegex.test(data.contactInfo.email)) {
    return 'Invalid contact email format';
  }
  
  // Optional: validate phone number if provided
  if (data.contactInfo.phone) {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(data.contactInfo.phone.replace(/\s+/g, ''))) {
      return 'Invalid phone number format';
    }
  }
  
  return null; // Validation passed
}

/**
 * Validates tournament data
 * @param data Tournament data to validate
 * @returns Error message if validation fails, null if validation passes
 */
export function validateTournament(data: any): string | null {
  // Check for required fields
  if (!data.name) return 'Tournament name is required';
  if (!data.game) return 'Game is required';
  if (!data.startDate) return 'Start date is required';
  if (!data.endDate) return 'End date is required';
  if (!data.registrationDeadline) return 'Registration deadline is required';
  if (!data.prizePool) return 'Prize pool is required';
  
  // Validate team size
  if (typeof data.teamSize !== 'number' || data.teamSize < 1) {
    return 'Team size must be a positive number';
  }
  
  // Validate max teams
  if (typeof data.maxTeams !== 'number' || data.maxTeams < 1) {
    return 'Maximum teams must be a positive number';
  }
  
  // Validate status if provided
  if (data.status && !['upcoming', 'ongoing', 'completed'].includes(data.status)) {
    return 'Invalid tournament status';
  }
  
  // Validate dates
  try {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const registrationDeadline = new Date(data.registrationDeadline);
    const now = new Date();
    
    if (registrationDeadline < now) {
      return 'Registration deadline cannot be in the past';
    }
    
    if (startDate < now) {
      return 'Start date cannot be in the past';
    }
    
    if (endDate < startDate) {
      return 'End date cannot be before start date';
    }
    
    if (registrationDeadline > startDate) {
      return 'Registration deadline must be before the start date';
    }
  } catch (error) {
    return 'Invalid date format';
  }
  
  return null; // Validation passed
}