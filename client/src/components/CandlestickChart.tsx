import React from "react";

/**
 * K线图数据点接口
 */
export interface CandlestickDataPoint {
  /** 时间戳或时间字符串 */
  time: string | number | Date;
  /** 开盘价 */
  open: number;
  /** 收盘价 */
  close: number;
  /** 最高价 */
  high: number;
  /** 最低价 */
  low: number;
  /** 成交量（可选） */
  volume?: number;
}

/**
 * K线图组件属性
 */
export interface CandlestickChartProps {
  /** K线数据数组 */
  data: CandlestickDataPoint[];
  /** 图表宽度（默认800） */
  width?: number;
  /** 图表高度（默认350） */
  height?: number;
  /** 内边距（默认40） */
  padding?: number;
  /** 上涨颜色（默认绿色） */
  bullishColor?: string;
  /** 下跌颜色（默认红色） */
  bearishColor?: string;
  /** 网格线颜色（默认当前文本颜色） */
  gridColor?: string;
  /** 网格线透明度（默认0.1） */
  gridOpacity?: number;
  /** 是否显示网格线（默认true） */
  showGrid?: boolean;
  /** 是否显示价格标签（默认true） */
  showPriceLabels?: boolean;
  /** 蜡烛宽度比例（0-1，默认0.6） */
  candleWidthRatio?: number;
  /** 自定义类名 */
  className?: string;
}

/**
 * K线图（蜡烛图）组件
 * 
 * @example
 * ```tsx
 * const data = [
 *   { time: '2024-01-01', open: 100, close: 105, high: 108, low: 98 },
 *   { time: '2024-01-02', open: 105, close: 102, high: 107, low: 100 },
 * ];
 * 
 * <CandlestickChart data={data} width={800} height={400} />
 * ```
 */
export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  width = 800,
  height = 350,
  padding = 40,
  bullishColor = "rgb(34, 197, 94)", // green-500
  bearishColor = "rgb(239, 68, 68)", // red-500
  gridColor = "currentColor",
  gridOpacity = 0.1,
  showGrid = true,
  showPriceLabels = true,
  candleWidthRatio = 0.6,
  className = "",
}) => {
  // 如果没有数据，显示空状态
  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: "100%", height }}
      >
        <p className="text-muted-foreground">暂无数据</p>
      </div>
    );
  }

  // 过滤掉无效数据
  const validData = data.filter(
    (d) => d.close > 0 && d.open > 0 && d.high > 0 && d.low > 0
  );

  if (validData.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: "100%", height }}
      >
        <p className="text-muted-foreground">数据无效</p>
      </div>
    );
  }

  // 计算价格范围
  const allPrices = validData.flatMap((d) => [d.high, d.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  // 计算绘图区域尺寸
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const candleWidth = Math.max(
    2,
    Math.min(20, (chartWidth / validData.length) * candleWidthRatio)
  );

  // 价格转Y坐标
  const priceToY = (price: number): number => {
    return padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  // 生成网格线的价格点
  const gridPrices = [0, 0.25, 0.5, 0.75, 1].map(
    (ratio) => minPrice + priceRange * ratio
  );

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div style={{ minWidth: Math.max(600, width) }}>
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="text-foreground"
        >
          {/* 网格线和价格标签 */}
          {showGrid &&
            gridPrices.map((price, index) => {
              const y = priceToY(price);
              return (
                <g key={index}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke={gridColor}
                    strokeOpacity={gridOpacity}
                  />
                  {showPriceLabels && (
                    <text
                      x={padding - 10}
                      y={y + 5}
                      textAnchor="end"
                      fontSize="12"
                      fill="currentColor"
                      opacity="0.5"
                    >
                      {price.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}

          {/* K线蜡烛 */}
          {validData.map((point, i) => {
            const x = padding + (i / (validData.length - 1)) * chartWidth;
            const { open, close, high, low } = point;

            // 计算Y坐标
            const yHigh = priceToY(high);
            const yLow = priceToY(low);
            const yOpen = priceToY(open);
            const yClose = priceToY(close);

            // 判断涨跌
            const isBullish = close >= open;
            const color = isBullish ? bullishColor : bearishColor;

            // 蜡烛体的位置和高度
            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.abs(yClose - yOpen) || 1;

            return (
              <g key={i}>
                {/* 上下影线 */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke={color}
                  strokeWidth="1"
                />
                {/* 蜡烛体 */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={color}
                  stroke={color}
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default CandlestickChart;
