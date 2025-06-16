// src/client/index.ts
import { Plugin } from '@nocobase/client';
import MapBlock from './MapBlock';

export class PluginYandexMapsClient extends Plugin {
  async load() {
    /* ------------------------------------------------------------------
     * 1️⃣  Регистрируем блок визуализации «Яндекс Карта»
     * ------------------------------------------------------------------ */
    // @ts-ignore — blockManager пока нет в типах SDK, но есть в рантайме
    (this.app as any).blockManager.add('yandex-map', {
      type: 'map',
      title: 'Яндекс Карта',
      icon: 'Map',
      component: MapBlock,
      dataSourceTypes: ['collection'],

      /** Свойства по умолчанию для нового блока */
      defaultProps: {
        coordinateField: 'coordinates',
        titleField: 'title',
        descriptionField: 'description',
        center: [55.751574, 37.573856], // Москва
        zoom: 10,
      },

      /** Схема настроек, которую увидит пользователь в Property-pane */
      settings: [
        {
          name: 'coordinateField',
          title: 'Поле координат (lat,lng)',
          type: 'string',
          default: 'coordinates',
          uiSchema: { 'x-component': 'Input' },
        },
        {
          name: 'titleField',
          title: 'Поле заголовка',
          type: 'string',
          default: 'title',
          uiSchema: { 'x-component': 'Input' },
        },
        {
          name: 'descriptionField',
          title: 'Поле описания',
          type: 'string',
          default: 'description',
          uiSchema: { 'x-component': 'Input' },
        },
        {
          name: 'center',
          title: 'Центр карты (lat,lng)',
          type: 'string',
          default: '55.751574,37.573856',
          uiSchema: { 'x-component': 'Input' },
        },
        {
          name: 'zoom',
          title: 'Zoom',
          type: 'number',
          default: 10,
          uiSchema: { 'x-component': 'NumberPicker' },
        },
      ],
    });

    /* ------------------------------------------------------------------
     * 2️⃣  Добавляем страницу настроек плагина (Integration → Yandex Maps)
     *     — только если в ядре реально есть pluginSettingsManager
     * ------------------------------------------------------------------ */
    // @ts-ignore — менеджер настроек плагинов может отсутствовать в 1.7.x
    const psm = (this.app as any).pluginSettingsManager;
    if (psm && typeof psm.addItem === 'function') {
      psm.addItem({
        name: 'yandexMaps',
        title: 'Yandex Maps',
        group: 'Integration',
        icon: 'Map',
        scope: 'app',           // глобальные настройки приложения
        schema: {
          type: 'object',
          properties: {
            apiKey: {
              title: 'API-ключ Яндекс Карт',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                password: true,
                clearable: true,
                placeholder: 'sk.••••••••••••',
              },
            },
            defaultCenter: {
              title: 'Центр по умолчанию (lat,lng)',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            defaultZoom: {
              title: 'Zoom по умолчанию',
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
          },
        },
      });
    }
  }
}

export default PluginYandexMapsClient;
