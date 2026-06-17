import Service, { service } from "@ember/service";
import { camelize, capitalize, dasherize } from "@ember/string";
import { restartableTask } from "ember-concurrency";

import DjangoDurationTransform from "timed/transforms/django-duration";

const DJANGO_DURATION_TRANSFORM = DjangoDurationTransform.create();

const META_MODELS = {
  project: {
    spentTime: { defaultValue: null, transform: DJANGO_DURATION_TRANSFORM },
    spentBillable: { defaultValue: null, transform: DJANGO_DURATION_TRANSFORM },
  },
  task: {
    spentTime: { defaultValue: null, transform: DJANGO_DURATION_TRANSFORM },
    spentBillable: { defaultValue: null, transform: DJANGO_DURATION_TRANSFORM },
  },
};

const ATTRIBUTE_MODELS = {
  project: {
    totalRemainingEffort: {
      defaultValue: null,
      transform: DJANGO_DURATION_TRANSFORM,
    },
  },
  task: {
    mostRecentRemainingEffort: {
      defaultValue: null,
      transform: DJANGO_DURATION_TRANSFORM,
    },
  },
};

/**
 * Service to fetch metadata and transform it if necessary
 *
 * @class MetadataFetcherService
 * @extends Ember.Service
 * @public
 */
export default class MetadataFetcherService extends Service {
  /**
   * fetch service to handle HTTP requests
   *
   * @property {Emberfetch} fetch
   * @public
   */
  @service fetch;

  /**
   * Task to fetch a single records metadata
   *
   * @method fetchSingleRecordMetadata
   * @param {String} type The type to fetch
   * @param {Number} id The id of the object to fetch
   * @return {Object} An object with the parsed metadata
   * @public
   */
  fetchSingleRecordMetadata = restartableTask(async (type, id) => {
    if (!id) {
      throw new Error(`${capitalize(type)} ID is missing`);
    }

    const {
      data: { attributes = {} },
      meta = {},
    } = await this.fetch.fetch(`/api/v1/${dasherize(type)}s/${id}`);

    const modelKey = camelize(type);

    const metaEntries = Object.entries(META_MODELS[modelKey]).map(
      ([key, { defaultValue, transform }]) => {
        const value = meta[dasherize(key)];
        return [key, value ? transform.deserialize(value) : defaultValue];
      },
    );

    const attrEntries = Object.entries(ATTRIBUTE_MODELS[modelKey]).map(
      ([key, { defaultValue, transform }]) => {
        const value = attributes[dasherize(key)];
        return [key, value ? transform.deserialize(value) : defaultValue];
      },
    );

    return Object.fromEntries([...attrEntries, ...metaEntries]);
  });
}
