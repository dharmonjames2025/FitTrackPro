export const formatters = {
  date(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  shortDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  },

  time(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  dateTime(date: Date | string): string {
    const d = new Date(date);
    return `${this.date(d)} at ${this.time(d)}`;
  },

  relativeTime(date: Date | string): string {
    const now = new Date();
    const d = new Date(date);
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return this.shortDate(d);
  },

  duration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  },

  weight(kg: number): string {
    return `${kg.toFixed(1)} kg`;
  },

  height(cm: number): string {
    return `${cm} cm`;
  },

  calories(cal: number): string {
    return `${Math.round(cal)} cal`;
  },

  macro(value: number, unit: string = 'g'): string {
    return `${Math.round(value)}${unit}`;
  },

  percentage(value: number): string {
    return `${Math.round(value)}%`;
  },

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  },

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },
};