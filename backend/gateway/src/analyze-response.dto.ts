import { ApiProperty } from '@nestjs/swagger';

export class ChartDatasetDto {
  @ApiProperty({ example: 'Units Sold' })
  label: string;

  @ApiProperty({ example: [1618.5, 1321, 1899] })
  data: number[];
}

export class ChartDataDto {
  @ApiProperty({ example: 'bar' })
  type: string;

  @ApiProperty({ example: [
    'Canada', 'Germany', 'France'
  ] })
  labels: string[];

  @ApiProperty({ type: [ChartDatasetDto] })
  datasets: ChartDatasetDto[];
}

export class AnalyzeResponseDto {
  @ApiProperty({ example: 'Units sold in Government segment by country' })
  summary: string;

  @ApiProperty({ type: ChartDataDto })
  chartData: ChartDataDto;
}
