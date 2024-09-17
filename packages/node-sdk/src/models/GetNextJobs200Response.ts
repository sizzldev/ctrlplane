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

import type { GetNextJobs200ResponseJobsInner } from "./GetNextJobs200ResponseJobsInner";
import { mapValues } from "../runtime";
import {
  GetNextJobs200ResponseJobsInnerFromJSON,
  GetNextJobs200ResponseJobsInnerFromJSONTyped,
  GetNextJobs200ResponseJobsInnerToJSON,
} from "./GetNextJobs200ResponseJobsInner";

/**
 *
 * @export
 * @interface GetNextJobs200Response
 */
export interface GetNextJobs200Response {
  /**
   *
   * @type {Array<GetNextJobs200ResponseJobsInner>}
   * @memberof GetNextJobs200Response
   */
  jobs?: Array<GetNextJobs200ResponseJobsInner>;
}

/**
 * Check if a given object implements the GetNextJobs200Response interface.
 */
export function instanceOfGetNextJobs200Response(
  value: object,
): value is GetNextJobs200Response {
  return true;
}

export function GetNextJobs200ResponseFromJSON(
  json: any,
): GetNextJobs200Response {
  return GetNextJobs200ResponseFromJSONTyped(json, false);
}

export function GetNextJobs200ResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GetNextJobs200Response {
  if (json == null) {
    return json;
  }
  return {
    jobs:
      json["jobs"] == null
        ? undefined
        : (json["jobs"] as Array<any>).map(
            GetNextJobs200ResponseJobsInnerFromJSON,
          ),
  };
}

export function GetNextJobs200ResponseToJSON(
  value?: GetNextJobs200Response | null,
): any {
  if (value == null) {
    return value;
  }
  return {
    jobs:
      value["jobs"] == null
        ? undefined
        : (value["jobs"] as Array<any>).map(
            GetNextJobs200ResponseJobsInnerToJSON,
          ),
  };
}
