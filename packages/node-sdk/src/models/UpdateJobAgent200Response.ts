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

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface UpdateJobAgent200Response
 */
export interface UpdateJobAgent200Response {
    /**
     * 
     * @type {string}
     * @memberof UpdateJobAgent200Response
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateJobAgent200Response
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateJobAgent200Response
     */
    workspaceId: string;
}

/**
 * Check if a given object implements the UpdateJobAgent200Response interface.
 */
export function instanceOfUpdateJobAgent200Response(value: object): value is UpdateJobAgent200Response {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('workspaceId' in value) || value['workspaceId'] === undefined) return false;
    return true;
}

export function UpdateJobAgent200ResponseFromJSON(json: any): UpdateJobAgent200Response {
    return UpdateJobAgent200ResponseFromJSONTyped(json, false);
}

export function UpdateJobAgent200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateJobAgent200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'workspaceId': json['workspaceId'],
    };
}

export function UpdateJobAgent200ResponseToJSON(value?: UpdateJobAgent200Response | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
        'name': value['name'],
        'workspaceId': value['workspaceId'],
    };
}

