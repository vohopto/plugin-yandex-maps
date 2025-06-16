import React, { useMemo } from 'react';
// @ts-ignore
import { usePluginSettings } from '@nocobase/client';
import { YMaps, Map as YMap, Placemark } from 'react-yandex-maps';

interface Props {
  coordinateField?: string;
  titleField?: string;
  descriptionField?: string;
  center?: [number, number];
  zoom?: number;
  height?: string | number;
  data?: Record<string, any>[];
}

const DEF_CENTER: [number, number] = [55.751574, 37.573856];

function parse(val?: unknown): [number, number] | null {
  if (typeof val !== 'string') return null;
  const [lat, lng] = val.split(',').map(Number);
  return isFinite(lat) && isFinite(lng) ? [lat, lng] : null;
}

export default function MapBlock({
  coordinateField = 'coordinates',
  titleField = 'title',
  descriptionField = 'description',
  center = DEF_CENTER,
  zoom = 10,
  height = '500px',
  data = [],
}: Props) {
  const [{ apiKey = '', defaultCenter = '', defaultZoom }] =
    usePluginSettings?.('yandexMaps') || [{}];

  const mapsKey = apiKey || (process.env as any).YANDEX_MAPS_API_KEY || '';
  const initCenter = parse(defaultCenter) || center;
  const initZoom = defaultZoom ?? zoom;

  const marks = useMemo(
    () =>
      data
        .map((row) => {
          const c = parse(row[coordinateField]);
          return c && { c, h: row[titleField], b: row[descriptionField] };
        })
        .filter(Boolean) as { c: [number, number]; h: any; b: any }[],
    [data, coordinateField, titleField, descriptionField]
  );

  return (
    <YMaps query={{ apikey: mapsKey, lang: 'ru_RU', load: 'package.full' }}>
      <YMap
        defaultState={{
          center: marks[0]?.c ?? initCenter,
          zoom: initZoom
        }}
        width="100%"
        height={height}
        modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
      >
        {marks.map((m, i) => (
          <Placemark
            key={i}
            geometry={m.c}
            properties={{
              balloonContentHeader: String(m.h ?? ''),
              balloonContentBody: String(m.b ?? '')
            }}
            options={{ preset: 'islands#redIcon' }}
          />
        ))}
      </YMap>
    </YMaps>
  );
}
