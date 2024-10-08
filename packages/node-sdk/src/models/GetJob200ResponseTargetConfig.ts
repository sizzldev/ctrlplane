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
 * @interface GetJob200ResponseTargetConfig
 */
export interface GetJob200ResponseTargetConfig {
  /**
   *
   * @type {string}
   * @memberof GetJob200ResponseTargetConfig
   */
  location?: string;
  /**
   *
   * @type {string}
   * @memberof GetJob200ResponseTargetConfig
   */
  project?: string;
}

/**
 * Check if a given object implements the GetJob200ResponseTargetConfig interface.
 */
export function instanceOfGetJob200ResponseTargetConfig(
  value: object,
): value is GetJob200ResponseTargetConfig {
  return true;
}

export function GetJob200ResponseTargetConfigFromJSON(
  json: any,
): GetJob200ResponseTargetConfig {
  return GetJob200ResponseTargetConfigFromJSONTyped(json, false);
}

export function GetJob200ResponseTargetConfigFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetJob200ResponseTargetConfig {
  if (json == null) {
    return json;
  }
  return {
    location: json["location"] == null ? undefined : json["location"],
    project: json["project"] == null ? undefined : json["project"],
  };
}

export function GetJob200ResponseTargetConfigToJSON(
  value?: GetJob200ResponseTargetConfig | null,
): any {
  if (value == null) {
    return value;
  }
  return {
    location: value["location"],
    project: value["project"],
  };
}
