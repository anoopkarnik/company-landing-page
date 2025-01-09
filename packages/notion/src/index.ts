import {Client } from '@notionhq/client'
import { BlockObjectRequest, CreateDatabaseParameters, CreateDatabaseResponse, CreatePageParameters, CreatePageResponse,
     GetDatabaseResponse, SearchParameters, SearchResponse } from '@notionhq/client/build/src/api-endpoints';

export const createDatabase = async ({apiToken,parent,title,properties}:{apiToken:string, parent:string,
     title:string, properties:any}) =>{
    const notion = new Client({auth: apiToken})
    let payload:CreateDatabaseParameters = {
        "parent": { "type": "page_id", "page_id": parent },
        "title": [
            {
                "type": "text",
                "text": {
                    "content": title
                }
            }
        ],
        "properties": properties
    }
    const response:CreateDatabaseResponse = await notion.databases.create(payload)
    return response;
}

export const queryDatabase = async ({apiToken,database_id, body}:{apiToken:string, database_id:string, body:SearchParameters}) =>{
    const notion = new Client({auth: apiToken})
    const query:any = {
        database_id: database_id,
        ...body
    }
    const response:SearchResponse = await notion.databases.query(query)
    if (response.hasOwnProperty('status')){
        return {results:[],has_more:false,next_cursor:''};
    }
    else{
        console.log(`sucessfully queried database - length - ${response.results.length} - has_more - ${response.has_more} - cursor - ${response.next_cursor}`);
    }
    return response;
}

export const getDatabaseProperties = async ({apiToken,database_id}:{apiToken:string, database_id:string}) =>{
    const notion = new Client({auth: apiToken})
    const response:GetDatabaseResponse = await notion.databases.retrieve({ database_id: database_id })
    return response;
}

export const createPage = async({apiToken,body}:{apiToken:string,body:CreatePageParameters})=>{
    const notion = new Client({auth: apiToken})
    console.log(`creating page with this ${JSON.stringify(body)}`)
    const response:CreatePageResponse = await notion.pages.create(body)
    if (response.hasOwnProperty('status')){
        console.log(JSON.stringify(response))
    }
    else{
        console.log(`sucessfully created page ${response.id}`);
    }
    return response;
}

export const modifyPage = async({apiToken,page_id,body}:{apiToken:string, page_id:string, body: CreatePageParameters})=>{
    const notion = new Client({auth: apiToken})
    console.log(`modifying page ${page_id} with this ${JSON.stringify(body)}`)
    const response:CreatePageResponse = await notion.pages.update({
        page_id: page_id,
        ...body
    })
    if (response.hasOwnProperty('status')){
        console.log(JSON.stringify(response))
    }
    else{
        console.log(`sucessfully modified page ${response.id}`);
    }
    return response;
}

export const getPage = async ({apiToken,page_id}:{apiToken:string, page_id:string}) =>{
    const notion = new Client({auth: apiToken})
    const response = await notion.pages.retrieve({ page_id: page_id })
    return response;
}

export const getBlockChildren = async ({apiToken,block_id}:{apiToken:string, block_id:string}) =>{
    const notion = new Client({auth: apiToken})
    const response = await notion.blocks.children.list({ block_id: block_id })
    return response;
}

export const deleteBlock = async ({apiToken,block_id}:{apiToken:string, block_id:string}) =>{
    const notion = new Client({auth: apiToken})
    const response = await notion.blocks.delete({ block_id: block_id })
    return response;
}

export const appendBlockChildren = async ({apiToken,block_id,children}:{apiToken:string, block_id:string,
    children:BlockObjectRequest[]
}) =>{
    const notion = new Client({auth: apiToken})
    const response = await notion.blocks.children.append({ block_id: block_id, children: children })
    return response;
}

export const deletePage = async ({apiToken,page_id}:{apiToken:string, page_id:string}) =>{
    const notion = new Client({auth: apiToken})
    const response = await notion.pages.update({ page_id: page_id, in_trash: true })
    return response;
}