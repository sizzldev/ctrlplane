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

import type { SetTargetProvidersTargetsRequestTargetsInner } from "./SetTargetProvidersTargetsRequestTargetsInner";
import { mapValues } from "../runtime";
import {
  SetTargetProvidersTargetsRequestTargetsInnerFromJSON,
  SetTargetProvidersTargetsRequestTargetsInnerFromJSONTyped,
  SetTargetProvidersTargetsRequestTargetsInnerToJSON,
} from "./SetTargetProvidersTargetsRequestTargetsInner";

/**
 *
 * @export
 * @interface SetTargetProvidersTargetsRequest
 */
export interface SetTargetProvidersTargetsRequest {
  /**
   *
   * @type {Array<SetTargetProvidersTargetsRequestTargetsInner>}
   * @memberof SetTargetProvidersTargetsRequest
   */
  targets: Array<SetTargetProvidersTargetsRequestTargetsInner>;
}

/**
 * Check if a given object implements the SetTargetProvidersTargetsRequest interface.
 */
export function instanceOfSetTargetProvidersTargetsRequest(
  value: object,
): value is SetTargetProvidersTargetsRequest {
  if (!("targets" in value) || value["targets"] === undefined) return false;
  return true;
}

export function SetTargetProvidersTargetsRequestFromJSON(
  json: any,
): SetTargetProvidersTargetsRequest {
  return SetTargetProvidersTargetsRequestFromJSONTyped(json, false);
}

export function SetTargetProvidersTargetsRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): SetTargetProvidersTargetsRequest {
  if (json == null) {
    return json;
  }
  return {
    targets: (json["targets"] as Array<any>).map(
      SetTargetProvidersTargetsRequestTargetsInnerFromJSON,
    ),
  };
}

export function SetTargetProvidersTargetsRequestToJSON(
  value?: SetTargetProvidersTargetsRequest | null,
): any {
  if (value == null) {
    return value;
  }
  return {
    targets: (value["targets"] as Array<any>).map(
      SetTargetProvidersTargetsRequestTargetsInnerToJSON,
    ),
  };
}
