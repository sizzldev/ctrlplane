/* tslint:disable */
/* eslint-disable */
/**
 * Ctrlplane API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from "../runtime";

/**
 *
 * @export
 * @interface CreateRelease200Response
 */
export interface CreateRelease200Response {
  /**
   *
   * @type {string}
   * @memberof CreateRelease200Response
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof CreateRelease200Response
   */
  version?: string;
  /**
   *
   * @type {object}
   * @memberof CreateRelease200Response
   */
  metadata?: object;
}

/**
 * Check if a given object implements the CreateRelease200Response interface.
 */
export function instanceOfCreateRelease200Response(
  value: object,
): value is CreateRelease200Response {
  return true;
}

export function CreateRelease200ResponseFromJSON(
  json: any,
): CreateRelease200Response {
  return CreateRelease200ResponseFromJSONTyped(json, false);
}

export function CreateRelease200ResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CreateRelease200Response {
  if (json == null) {
    return json;
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    version: json["version"] == null ? undefined : json["version"],
    metadata: json["metadata"] == null ? undefined : json["metadata"],
  };
}

export function CreateRelease200ResponseToJSON(
  value?: CreateRelease200Response | null,
): any {
  if (value == null) {
    return value;
  }
  return {
    id: value["id"],
    version: value["version"],
    metadata: value["metadata"],
  };
}
