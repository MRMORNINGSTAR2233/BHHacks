import { Achievement, GameStatistics } from '@/app/lib/types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'brave_explorer',
    title: 'Brave Explorer',
    description: 'Complete 5 story segments',
    icon: '🎖️',
  },
  {
    id: 'fearless',
    title: 'Fearless',
    description: 'Reach 100% fear level',
    icon: '💀',
  },
  {
    id: 'decision_maker',
    title: 'Decision Maker',
    description: 'Make 10 choices',
    icon: '🎯',
  },
  {
    id: 'survivor',
    title: 'Survivor',
    description: 'Complete 15 story segments',
    icon: '🏆',
  },
  {
    id: 'story_master',
    title: 'Story Master',
    description: 'Make 20 choices',
    icon: '📚',
  },
];

export function checkAchievements(
  stats: GameStatistics,
  unlockedAchievements: Achievement[]
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.has(achievement.id)) continue;

    let shouldUnlock = false;

    switch (achievement.id) {
      case 'brave_explorer':
        shouldUnlock = stats.choicesMade >= 5;
        break;
      case 'fearless':
        shouldUnlock = stats.fearLevel >= 100;
        break;
      case 'decision_maker':
        shouldUnlock = stats.choicesMade >= 10;
        break;
      case 'survivor':
        shouldUnlock = stats.choicesMade >= 15;
        break;
      case 'story_master':
        shouldUnlock = stats.choicesMade >= 20;
        break;
    }

    if (shouldUnlock) {
      newlyUnlocked.push({
        ...achievement,
        unlockedAt: new Date(),
      });
    }
  }

  return newlyUnlocked;
}
