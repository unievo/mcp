import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_VERIFICATION_FIELDS = ['codeHash', 'status'];

interface AccountVerificationSource {
    abi: any;
    contract: any;
}

interface VerificationDetails {
    codeHash: string;
    source?: AccountVerificationSource;
    status: string;
    ipfsFileHash?: string;
    isVerified?: boolean;
    verifiedAt?: number;
    verifier?: string;
    repository?: string;
    commitHash?: string;
    compilerVersion?: string;
    contractMetadata?: {
        name: string;
        version: string;
        authors: string[];
        description: string;
        license: string;
    };
}

export const accountVerificationTools = [
    {
        name: 'get-account-verification',
        description: 'Returns contract verification details',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Contract address'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['address']
        }
    }
];

export async function handleGetAccountVerification(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_VERIFICATION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/verification${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<VerificationDetails>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredVerification: Partial<VerificationDetails> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredVerification as any)[field] = response[field as keyof VerificationDetails];
                }
            });
            filteredResponse = filteredVerification as VerificationDetails;
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredResponse, null, 2)
                }
            ]
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get account verification details: ${errorMessage}`
        );
    }
}
