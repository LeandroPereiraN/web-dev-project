export type ContentReportReason =
  | 'ILLEGAL_CONTENT'
  | 'FALSE_INFORMATION'
  | 'OFFENSIVE_CONTENT'
  | 'SPAM'
  | 'SCAM'
  | 'OTHER';

export interface ReportReasonOption {
  value: ContentReportReason;
  label: string;
  description: string;
}

export interface ServiceReportPayload {
  reason: ContentReportReason;
  details?: string;
  otherReasonText?: string;
  reporterEmail?: string;
}

export const REPORT_REASON_OPTIONS: ReadonlyArray<ReportReasonOption> = [
  {
    value: 'ILLEGAL_CONTENT',
    label: 'Contenido ilegal',
    description: 'Promueve actividades ilegales como drogas, armas o trata de personas.',
  },
  {
    value: 'FALSE_INFORMATION',
    label: 'Información falsa o engañosa',
    description: 'Los datos publicados no coinciden con la realidad o buscan confundir.',
  },
  {
    value: 'OFFENSIVE_CONTENT',
    label: 'Contenido ofensivo o inapropiado',
    description: 'Lenguaje discriminatorio, imágenes sensibles o material inapropiado.',
  },
  {
    value: 'SPAM',
    label: 'Spam o duplicado',
    description: 'Publicación repetida, enlaces irrelevantes o promociones masivas.',
  },
  {
    value: 'SCAM',
    label: 'Estafa',
    description: 'Busca engañar para obtener dinero o datos personales.',
  },
  {
    value: 'OTHER',
    label: 'Otros',
    description: 'Otra situación no listada. Cuéntanos brevemente para poder revisarlo.',
  },
];
