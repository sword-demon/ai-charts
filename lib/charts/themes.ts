import type { ChartTheme } from '@/lib/types';

export const DEFAULT_THEME: ChartTheme = {
  name: 'default',
  colors: [
    '#5470c6', '#91cc75', '#fac858', '#ee6666',
    '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
    '#ea7ccc', '#5fb3d4'
  ],
  backgroundColor: '#ffffff',
  textStyle: {
    color: '#333333',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 12
  },
  title: {
    textStyle: {
      color: '#333333',
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  legend: {
    textStyle: {
      color: '#333333'
    }
  },
  grid: {
    borderColor: '#e6e6e6'
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#cccccc'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#f0f0f0'
      }
    }
  },
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#cccccc'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#f0f0f0'
      }
    }
  }
};

export const DARK_THEME: ChartTheme = {
  name: 'dark',
  colors: [
    '#4992ff', '#7cffb2', '#fddd60', '#ff6e76',
    '#58d9f9', '#05c091', '#ff8a45', '#8d48e3',
    '#dd79ff', '#00d4d6'
  ],
  backgroundColor: '#1f1f1f',
  textStyle: {
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 12
  },
  title: {
    textStyle: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  legend: {
    textStyle: {
      color: '#ffffff'
    }
  },
  grid: {
    borderColor: '#333333'
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#666666'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#2a2a2a'
      }
    }
  },
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#666666'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#2a2a2a'
      }
    }
  }
};

export const BUSINESS_THEME: ChartTheme = {
  name: 'business',
  colors: [
    '#2563eb', '#dc2626', '#059669', '#d97706',
    '#7c3aed', '#db2777', '#0891b2', '#65a30d',
    '#e11d48', '#4338ca'
  ],
  backgroundColor: '#ffffff',
  textStyle: {
    color: '#1f2937',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 12
  },
  title: {
    textStyle: {
      color: '#111827',
      fontSize: 20,
      fontWeight: '600'
    }
  },
  legend: {
    textStyle: {
      color: '#374151'
    }
  },
  grid: {
    borderColor: '#e5e7eb'
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#d1d5db'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    }
  },
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#d1d5db'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    }
  }
};

export const MINIMAL_THEME: ChartTheme = {
  name: 'minimal',
  colors: [
    '#374151', '#6b7280', '#9ca3af', '#d1d5db',
    '#e5e7eb', '#f3f4f6', '#1f2937', '#4b5563',
    '#111827', '#030712'
  ],
  backgroundColor: '#ffffff',
  textStyle: {
    color: '#4b5563',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 11
  },
  title: {
    textStyle: {
      color: '#111827',
      fontSize: 16,
      fontWeight: '500'
    }
  },
  legend: {
    textStyle: {
      color: '#6b7280'
    }
  },
  grid: {
    borderColor: '#e5e7eb'
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#f9fafb'
      }
    }
  },
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#f9fafb'
      }
    }
  }
};

export const COLORFUL_THEME: ChartTheme = {
  name: 'colorful',
  colors: [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
    '#f59e0b', '#10b981'
  ],
  backgroundColor: '#ffffff',
  textStyle: {
    color: '#1f2937',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 12
  },
  title: {
    textStyle: {
      color: '#111827',
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  legend: {
    textStyle: {
      color: '#374151'
    }
  },
  grid: {
    borderColor: '#e5e7eb'
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#d1d5db'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    }
  },
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#d1d5db'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    }
  }
};

export const GRADIENT_THEME: ChartTheme = {
  name: 'gradient',
  colors: [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#fa709a', '#fee140'
  ],
  backgroundColor: '#ffffff',
  textStyle: {
    color: '#2d3748',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 12
  },
  title: {
    textStyle: {
      color: '#1a202c',
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  legend: {
    textStyle: {
      color: '#4a5568'
    }
  },
  grid: {
    borderColor: '#e2e8f0'
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#cbd5e0'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#f7fafc'
      }
    }
  },
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#cbd5e0'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#f7fafc'
      }
    }
  }
};

export const THEME_REGISTRY: Record<string, ChartTheme> = {
  default: DEFAULT_THEME,
  dark: DARK_THEME,
  business: BUSINESS_THEME,
  minimal: MINIMAL_THEME,
  colorful: COLORFUL_THEME,
  gradient: GRADIENT_THEME
};

export class ThemeManager {
  private currentTheme: ChartTheme = DEFAULT_THEME;

  setTheme(themeName: string): void {
    const theme = THEME_REGISTRY[themeName];
    if (!theme) {
      console.warn(`主题 "${themeName}" 不存在，使用默认主题`);
      this.currentTheme = DEFAULT_THEME;
      return;
    }
    this.currentTheme = theme;
  }

  getCurrentTheme(): ChartTheme {
    return { ...this.currentTheme };
  }

  getThemeColors(): string[] {
    return [...this.currentTheme.colors];
  }

  getThemeNames(): string[] {
    return Object.keys(THEME_REGISTRY);
  }

  registerCustomTheme(name: string, theme: ChartTheme): void {
    THEME_REGISTRY[name] = { ...theme, name };
  }

  applyThemeToOption(option: Record<string, unknown>): Record<string, unknown> {
    const theme = this.currentTheme;

    return {
      ...option,
      color: theme.colors,
      backgroundColor: theme.backgroundColor,
      textStyle: theme.textStyle,
      title: {
        ...option.title,
        textStyle: {
          ...option.title?.textStyle,
          ...theme.title.textStyle
        }
      },
      legend: {
        ...option.legend,
        textStyle: {
          ...option.legend?.textStyle,
          ...theme.legend.textStyle
        }
      },
      xAxis: this.applyAxisTheme(option.xAxis, theme.categoryAxis),
      yAxis: this.applyAxisTheme(option.yAxis, theme.valueAxis),
      grid: {
        ...option.grid,
        borderColor: theme.grid.borderColor
      }
    };
  }

  private applyAxisTheme(axis: unknown, axisTheme: Record<string, unknown>): unknown {
    if (!axis) return axis;

    if (Array.isArray(axis)) {
      return axis.map(item => ({
        ...item,
        axisLine: {
          ...item.axisLine,
          lineStyle: {
            ...item.axisLine?.lineStyle,
            ...axisTheme.axisLine.lineStyle
          }
        },
        splitLine: {
          ...item.splitLine,
          lineStyle: {
            ...item.splitLine?.lineStyle,
            ...axisTheme.splitLine.lineStyle
          }
        }
      }));
    }

    return {
      ...axis,
      axisLine: {
        ...axis.axisLine,
        lineStyle: {
          ...axis.axisLine?.lineStyle,
          ...axisTheme.axisLine.lineStyle
        }
      },
      splitLine: {
        ...axis.splitLine,
        lineStyle: {
          ...axis.splitLine?.lineStyle,
          ...axisTheme.splitLine.lineStyle
        }
      }
    };
  }

  getThemePreview(themeName: string): {
    name: string;
    colors: string[];
    backgroundColor: string;
    textColor: string;
  } | null {
    const theme = THEME_REGISTRY[themeName];
    if (!theme) return null;

    return {
      name: theme.name,
      colors: theme.colors.slice(0, 5), // 只显示前5个颜色作为预览
      backgroundColor: theme.backgroundColor,
      textColor: theme.textStyle.color
    };
  }

  isDarkTheme(themeName?: string): boolean {
    const theme = themeName ? THEME_REGISTRY[themeName] : this.currentTheme;
    if (!theme) return false;

    // 通过背景色判断是否为深色主题
    const bgColor = theme.backgroundColor.toLowerCase();
    return bgColor === '#1f1f1f' || bgColor === '#000000' || bgColor.includes('dark');
  }

  getContrastColor(themeName?: string): string {
    return this.isDarkTheme(themeName) ? '#ffffff' : '#000000';
  }
}

export const themeManager = new ThemeManager();

export const getTheme = (name: string): ChartTheme | null => {
  return THEME_REGISTRY[name] || null;
};

export const getAllThemes = (): ChartTheme[] => {
  return Object.values(THEME_REGISTRY);
};

export const createCustomTheme = (
  name: string,
  colors: string[],
  options?: Partial<ChartTheme>
): ChartTheme => {
  return {
    name,
    colors,
    backgroundColor: options?.backgroundColor || '#ffffff',
    textStyle: {
      color: options?.textStyle?.color || '#333333',
      fontFamily: options?.textStyle?.fontFamily || 'system-ui, sans-serif',
      fontSize: options?.textStyle?.fontSize || 12
    },
    title: {
      textStyle: {
        color: options?.title?.textStyle?.color || '#333333',
        fontSize: options?.title?.textStyle?.fontSize || 18,
        fontWeight: options?.title?.textStyle?.fontWeight || 'bold'
      }
    },
    legend: {
      textStyle: {
        color: options?.legend?.textStyle?.color || '#333333'
      }
    },
    grid: {
      borderColor: options?.grid?.borderColor || '#e6e6e6'
    },
    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: options?.categoryAxis?.axisLine?.lineStyle?.color || '#cccccc'
        }
      },
      splitLine: {
        lineStyle: {
          color: options?.categoryAxis?.splitLine?.lineStyle?.color || '#f0f0f0'
        }
      }
    },
    valueAxis: {
      axisLine: {
        lineStyle: {
          color: options?.valueAxis?.axisLine?.lineStyle?.color || '#cccccc'
        }
      },
      splitLine: {
        lineStyle: {
          color: options?.valueAxis?.splitLine?.lineStyle?.color || '#f0f0f0'
        }
      }
    }
  };
};

export default themeManager;