import { MetadataController } from '../controller/metaData.controller';

export const metadataRoute = [
  {
    method: 'post',
    route: '/api/metadata',
    controller: MetadataController,
    action: 'saveMetadata',
  },
  {
    method: 'get',
    route: '/api/metadata',
    controller: MetadataController,
    action: 'allMetadatas',
  },
  {
    method: 'get',
    route: '/api/metadata/:id',
    controller: MetadataController,
    action: 'findMetadata',
  },
  {
    method: 'put',
    route: '/api/metadata/:id',
    controller: MetadataController,
    action: 'updateMetadata',
  },

  {
    method: 'put',
    route: '/api/metadata/:id',
    controller: MetadataController,
    action: 'deleteMetadata',
  },
];
