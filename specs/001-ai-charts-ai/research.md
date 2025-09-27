# Research: AI Charts Website

## Alibaba Cloud Bailian Integration

**Decision**: Use OpenAI SDK with Alibaba Cloud Bailian compatible API
**Rationale**:
- Bailian provides compatible OpenAI API endpoints
- Enables use of familiar OpenAI SDK patterns
- qwen3-max-preview model optimized for Chinese and English
- JSON structured output support for chart configurations

**Implementation Pattern**:
```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

// Use response_format: { type: "json_object" } for structured output
```

**Alternatives considered**:
- Direct Bailian SDK: More complex integration
- Claude API: Different pricing model, less optimized for Chinese
- Local LLM: Resource intensive, deployment complexity

## ECharts Integration with React

**Decision**: Use echarts-for-react wrapper with TypeScript definitions
**Rationale**:
- Official React wrapper for ECharts
- Proper TypeScript support
- Handles component lifecycle automatically
- Supports all ECharts chart types

**Implementation Pattern**:
```typescript
import ReactECharts from 'echarts-for-react';

interface ChartConfig {
  title: { text: string };
  xAxis: { data: string[] };
  yAxis: {};
  series: Array<{
    name: string;
    type: 'bar' | 'line' | 'pie' | 'scatter';
    data: number[];
  }>;
}
```

**Alternatives considered**:
- Direct ECharts DOM manipulation: More complex React integration
- Recharts: Limited chart types compared to ECharts
- Chart.js: Less powerful for complex visualizations

## Natural Language Processing for Chart Generation

**Decision**: Use structured prompts with JSON schema validation
**Rationale**:
- Consistent output format for chart configurations
- Reduces parsing complexity
- Enables validation and error handling
- Supports iterative conversation context

**System Prompt Strategy**:
```
You are a chart generation assistant. Analyze user input and extract:
1. Numerical data points
2. Labels and categories
3. Chart type (if specified) or recommend optimal type
4. Title and axis labels

Always respond with valid JSON in this format:
{
  "chartType": "bar|line|pie|scatter|...",
  "title": "string",
  "xAxis": { "data": ["label1", "label2"] },
  "yAxis": {},
  "series": [{ "name": "string", "type": "string", "data": [numbers] }]
}
```

**Alternatives considered**:
- Text parsing with regex: Unreliable for varied input formats
- Multiple API calls: Higher latency and cost
- Client-side parsing: Limited by JavaScript NLP capabilities

## State Management for Conversation Context

**Decision**: Use React Context + useState for conversation history
**Rationale**:
- Simple state management for single-page application
- No external state library dependencies
- Easy to maintain conversation history
- Supports real-time updates

**Implementation Pattern**:
```typescript
interface ConversationContext {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  currentChart: ChartConfig | null;
  addMessage: (message: Message) => void;
  updateChart: (config: ChartConfig) => void;
}
```

**Alternatives considered**:
- Redux: Overkill for simple conversation state
- Zustand: Additional dependency for minimal benefit
- Local storage: Privacy concerns mentioned as not required

## Responsive Design with Tailwind CSS

**Decision**: Use Tailwind CSS with shadcn/ui component library
**Rationale**:
- Constitutional requirement
- Utility-first approach for rapid development
- shadcn/ui provides accessible components
- Built-in responsive design patterns

**Implementation Pattern**:
- Mobile-first responsive breakpoints
- Flexible grid layouts for chart display
- Touch-friendly input controls
- Accessible color schemes and typography

**Alternatives considered**:
- CSS Modules: More verbose, less constitutional compliance
- Styled Components: Runtime CSS generation overhead
- Pure CSS: Longer development time, less maintainable

## Internationalization (i18n)

**Decision**: Use Next.js built-in internationalization with react-i18next
**Rationale**:
- Built into Next.js framework
- Supports multiple languages as required
- Can handle both UI and data processing languages
- Minimal setup overhead

**Implementation Pattern**:
- Language detection from browser settings
- Separate translation files for each language
- AI prompts can include language context
- Chart labels and titles support localization

**Alternatives considered**:
- Manual translation management: Not scalable
- External i18n services: Additional complexity and cost
- Client-side only i18n: SEO limitations

## Error Handling and Toast Notifications

**Decision**: Use shadcn/ui toast component with React Error Boundaries
**Rationale**:
- Constitutional requirement for consistent UI
- Graceful error handling for AI API failures
- User-friendly error messages
- Non-blocking notifications

**Implementation Pattern**:
```typescript
// API error handling
try {
  const response = await fetch('/api/charts/generate', { ... });
  if (!response.ok) throw new Error('Chart generation failed');
} catch (error) {
  toast({
    title: "Error",
    description: "Please check your input and try again",
    variant: "destructive"
  });
}
```

**Alternatives considered**:
- Alert dialogs: More intrusive user experience
- Console logging only: Poor user experience
- Custom notification system: Reinventing existing solutions

## Performance Optimization

**Decision**: Implement lazy loading and memoization for chart rendering
**Rationale**:
- Large ECharts bundles benefit from code splitting
- Memoization prevents unnecessary re-renders
- Lazy loading improves initial page load
- Responsive design works across devices

**Implementation Pattern**:
- React.lazy() for chart components
- React.memo() for expensive chart configurations
- Dynamic imports for ECharts themes
- Debounced input for real-time updates

**Alternatives considered**:
- Server-side rendering for charts: Complex setup, limited interactivity
- Pre-built chart images: Not interactive, limited customization
- Web Workers: Overkill for current requirements

## Testing Strategy

**Decision**: Jest + React Testing Library + Playwright for comprehensive testing
**Rationale**:
- Unit tests for AI integration logic
- Component tests for React components
- E2E tests for complete user workflows
- Constitutional requirement for testability

**Test Coverage Areas**:
- AI API integration and error handling
- Chart configuration generation and validation
- React component rendering and interactions
- Responsive design across device sizes
- Conversation context management

**Alternatives considered**:
- Cypress only: Limited unit testing capabilities
- Manual testing only: Not scalable or reliable
- Storybook testing: Good for components but incomplete coverage