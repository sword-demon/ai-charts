# Data Model: AI Charts Website

## Core Entities

### UserPrompt
Natural language text input containing data descriptions and chart specifications.

**Fields**:
- `content: string` - The raw user input text
- `timestamp: Date` - When the prompt was submitted
- `language?: string` - Detected or specified language (optional)

**Validation Rules**:
- Content must not be empty or only whitespace
- Maximum length: 10,000 characters
- Must contain at least one numerical value or data reference

**State Transitions**:
1. `pending` - Prompt submitted, awaiting AI processing
2. `processing` - AI is analyzing the prompt
3. `completed` - AI has generated chart configuration
4. `error` - Processing failed, user needs to retry

### ExtractedData
Structured data points extracted from user prompts by AI.

**Fields**:
- `labels: string[]` - Category or axis labels
- `datasets: Dataset[]` - Array of data series
- `metadata: DataMetadata` - Additional context information

**Dataset Structure**:
```typescript
interface Dataset {
  name: string;           // Series name/label
  values: number[];       // Numerical data points
  type?: ChartType;       // Suggested chart type for this series
}
```

**DataMetadata Structure**:
```typescript
interface DataMetadata {
  title?: string;         // Suggested chart title
  xAxisLabel?: string;    // X-axis label
  yAxisLabel?: string;    // Y-axis label
  chartType?: ChartType;  // Overall recommended chart type
  context?: string;       // Additional context from user prompt
}
```

### ChartConfiguration
ECharts-compatible configuration object for rendering charts.

**Fields**:
- `title: TitleOption` - Chart title configuration
- `xAxis: XAxisOption` - X-axis configuration
- `yAxis: YAxisOption` - Y-axis configuration
- `series: SeriesOption[]` - Data series configurations
- `tooltip: TooltipOption` - Tooltip settings
- `legend: LegendOption` - Legend configuration
- `responsive: boolean` - Whether chart is responsive

**ECharts Type Mapping**:
```typescript
type ChartType =
  | 'bar' | 'line' | 'pie' | 'scatter' | 'area'
  | 'radar' | 'gauge' | 'funnel' | 'treemap'
  | 'heatmap' | 'boxplot' | 'candlestick';

interface SeriesOption {
  name: string;
  type: ChartType;
  data: number[] | Array<{name: string, value: number}>;
  emphasis?: object;
  itemStyle?: object;
}
```

### ConversationContext
Maintains history and context for iterative chart improvements.

**Fields**:
- `sessionId: string` - Unique session identifier
- `messages: Message[]` - Conversation history
- `currentChart: ChartConfiguration | null` - Active chart state
- `previousVersions: ChartConfiguration[]` - Chart version history
- `createdAt: Date` - Session start time
- `lastActivityAt: Date` - Last interaction time

**Message Structure**:
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chartConfig?: ChartConfiguration; // For assistant messages with charts
}
```

**Relationships**:
- One ConversationContext contains multiple Messages
- Each user Message can generate one ExtractedData
- Each ExtractedData produces one ChartConfiguration
- ConversationContext maintains history of ChartConfigurations

### ToastNotification
User interface element for displaying system feedback and errors.

**Fields**:
- `id: string` - Unique notification identifier
- `type: 'success' | 'error' | 'warning' | 'info'` - Notification type
- `title: string` - Main notification message
- `description?: string` - Additional details (optional)
- `duration: number` - Auto-dismiss timeout in milliseconds
- `dismissible: boolean` - Whether user can manually dismiss

**Usage Patterns**:
- Error notifications for invalid input or AI processing failures
- Success notifications for successful chart generation
- Warning notifications for data interpretation uncertainties
- Info notifications for helpful tips and suggestions

## Entity Relationships

```
ConversationContext (1) ←→ (n) Message
Message (user) (1) → (1) ExtractedData
ExtractedData (1) → (1) ChartConfiguration
ConversationContext (1) ←→ (n) ChartConfiguration
```

## Data Flow

1. **Input Phase**: User submits UserPrompt through UI
2. **Processing Phase**: AI analyzes prompt and creates ExtractedData
3. **Generation Phase**: ExtractedData is transformed into ChartConfiguration
4. **Rendering Phase**: ChartConfiguration is passed to ECharts component
5. **Context Phase**: All data is stored in ConversationContext for future reference
6. **Iteration Phase**: Subsequent user prompts reference ConversationContext

## Validation Rules

### Input Validation
- UserPrompt content must contain recognizable data patterns
- Extracted numerical values must be valid numbers
- Chart type must be supported by ECharts library
- Language specification must be valid locale code

### Business Logic Validation
- Each dataset must have at least one numerical value
- Labels array length must match or exceed data array length
- Chart type must be appropriate for data dimensionality
- Conversation context must not exceed memory limits

### Output Validation
- ChartConfiguration must be valid ECharts option object
- All required ECharts properties must be present
- Chart must be renderable without errors
- Responsive settings must be properly configured

## Error Handling

### Data Extraction Errors
- **No Data Found**: When prompt contains no numerical data
- **Ambiguous Data**: When data interpretation is unclear
- **Invalid Format**: When data format is not recognizable
- **Size Limits**: When data exceeds processing capabilities

### Chart Generation Errors
- **Unsupported Type**: When requested chart type doesn't fit data
- **Configuration Error**: When ECharts config is invalid
- **Rendering Error**: When chart fails to display
- **Theme Error**: When chart theme is not available

### Recovery Strategies
- Graceful degradation to simpler chart types
- Fallback to default configurations
- User guidance through toast notifications
- Conversation reset for irrecoverable errors