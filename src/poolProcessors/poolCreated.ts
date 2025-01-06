import { SuiObjectTypeProcessor } from "@sentio/sdk/sui"
import { ChainId } from "@sentio/chain";


import { events as afv2_events} from "../types/sui/aftermath_v1.js";
import { events as afv1_events } from "../types/sui/aftermath_v1.js";
import { factory, config } from "../types/sui/cetus_factory.js"; 
import { pool_factory as turbos_factory, pool as turbos_pool } from "../types/sui/turbos_factory.js";
import { pool, registry } from "../types/sui/deepbook2.js";

import {MoveFetchConfig } from '@sentio/protos'

const fetchConfig: MoveFetchConfig = {
  resourceChanges: true,
  allEvents: true,
  inputs: true
}


export function initAFPoolsProcessor() {
    // aftermath v2
    afv2_events.bind()
    .onEventCreatedPoolEvent((event, ctx) => {
        console.log("[Aftermath v2] CreatedPoolEvent triggered:", event);

        ctx.eventLogger.emit("afv2_create_pool_event", { 
            pool_id: event.data_decoded.pool_id,
            name: event.data_decoded.name,
            creator: event.data_decoded.creator,
            lp_type: event.data_decoded.lp_type,
            coins: JSON.stringify(event.data_decoded.coins),
            weights: JSON.stringify(event.data_decoded.weights.map(weight => weight.toString())),
            flatness: event.data_decoded.flatness,
            fees_swap_in: JSON.stringify(event.data_decoded.fees_swap_in.map(fee => fee.toString())),
            fees_swap_out: JSON.stringify(event.data_decoded.fees_swap_out.map(fee => fee.toString())),
            fees_deposit: JSON.stringify(event.data_decoded.fees_deposit.map(fee => fee.toString())),
            fees_withdraw: JSON.stringify(event.data_decoded.fees_withdraw.map(fee => fee.toString())),
            sender: event.sender,
            storage_cost: ctx.transaction.effects?.gasUsed.storageCost,
            gas_computation: ctx.transaction.effects?.gasUsed.computationCost,
            nonrefundable_storage_fee: ctx.transaction.effects?.gasUsed.nonRefundableStorageFee,
            storage_rebate: ctx.transaction.effects?.gasUsed.storageRebate,
            event_sequence: ctx.eventIndex
        });
    }, fetchConfig)

    // aftermath v1
    afv1_events.bind()
    .onEventCreatedPoolEvent((event, ctx) => {
        console.log("[Aftermath v1] CreatedPoolEvent triggered:", event);

        ctx.eventLogger.emit("afv1_create_pool_event", { 
            pool_id: event.data_decoded.pool_id,
            name: event.data_decoded.name,
            creator: event.data_decoded.creator,
            lp_type: event.data_decoded.lp_type,
            coins: JSON.stringify(event.data_decoded.coins),
            weights: JSON.stringify(event.data_decoded.weights.map(weight => weight.toString())),
            flatness: event.data_decoded.flatness,
            fees_swap_in: JSON.stringify(event.data_decoded.fees_swap_in.map(fee => fee.toString())),
            fees_swap_out: JSON.stringify(event.data_decoded.fees_swap_out.map(fee => fee.toString())),
            fees_deposit: JSON.stringify(event.data_decoded.fees_deposit.map(fee => fee.toString())),
            fees_withdraw: JSON.stringify(event.data_decoded.fees_withdraw.map(fee => fee.toString())),
            sender: event.sender,
            storage_cost: ctx.transaction.effects?.gasUsed.storageCost,
            gas_computation: ctx.transaction.effects?.gasUsed.computationCost,
            nonrefundable_storage_fee: ctx.transaction.effects?.gasUsed.nonRefundableStorageFee,
            storage_rebate: ctx.transaction.effects?.gasUsed.storageRebate,
            event_sequence: ctx.eventIndex
        });
    }, fetchConfig)

    // cetus factory events
    factory.bind()
    .onEventCreatePoolEvent((event, ctx) => {
        console.log("[Cetus Factory] CreatePoolEvent triggered:", event);

        ctx.eventLogger.emit("cetus4_create_pool_event", { 
            pool_id: event.data_decoded.pool_id,
            coin_type_a: event.data_decoded.coin_type_a,
            coin_type_b: event.data_decoded.coin_type_b,
            tick_spacing: event.data_decoded.tick_spacing,
            sender: event.sender,
            storage_cost: ctx.transaction.effects?.gasUsed.storageCost,
            gas_computation: ctx.transaction.effects?.gasUsed.computationCost,
            nonrefundable_storage_fee: ctx.transaction.effects?.gasUsed.nonRefundableStorageFee,
            storage_rebate: ctx.transaction.effects?.gasUsed.storageRebate,
            event_sequence: ctx.eventIndex
        });
    }, fetchConfig)
    config.bind()
    .onEventFeeTier((event, ctx) => {
        console.log("[Cetus Config] FeeTier event triggered:", event);

        ctx.eventLogger.emit("cetus4_fee_tier_event", { 
            tick_spacing: event.data_decoded.tick_spacing,
            fee_rate: event.data_decoded.fee_rate,
            sender: event.sender,
            storage_cost: ctx.transaction.effects?.gasUsed.storageCost,
            gas_computation: ctx.transaction.effects?.gasUsed.computationCost,
            nonrefundable_storage_fee: ctx.transaction.effects?.gasUsed.nonRefundableStorageFee,
            storage_rebate: ctx.transaction.effects?.gasUsed.storageRebate,
            event_sequence: ctx.eventIndex
        });
    }, fetchConfig)

    // 1/6/25 TURBOS WORKS WELL. Incomplete coin info though
    // turbos factory events
    turbos_factory.bind()
    .onEventPoolCreatedEvent((event, ctx) => {
        console.log("[Turbos Factory] PoolCreatedEvent triggered:", event);

        ctx.eventLogger.emit("turbos_pool_created", { 
            account: event.data_decoded.account,
            pool: event.data_decoded.pool,
            fee: event.data_decoded.fee,
            tick_spacing: event.data_decoded.tick_spacing,
            fee_protocol: event.data_decoded.fee_protocol,
            sqrt_price: event.data_decoded.sqrt_price,
            sender: event.sender,
            storage_cost: ctx.transaction.effects?.gasUsed.storageCost,
            gas_computation: ctx.transaction.effects?.gasUsed.computationCost,
            nonrefundable_storage_fee: ctx.transaction.effects?.gasUsed.nonRefundableStorageFee,
            storage_rebate: ctx.transaction.effects?.gasUsed.storageRebate,
            event_sequence: ctx.eventIndex
        });
    }, fetchConfig)

    // Turbos Pool Objects
    SuiObjectTypeProcessor.bind({
        objectType: turbos_factory.PoolConfig.type(),
        network: ChainId.SUI_MAINNET
    })
    .onTimeInterval(async (self, _, ctx) => {
        try {
            // Get pools from dynamic fields
            const tableContents = await ctx.client.getDynamicFields({
                parentId: self.data_decoded.pools.id.id,
            });
            
            // Fetch and transform pool data
            const poolPromises = tableContents.data.map(async (field) => {
                const poolData = await ctx.client.getObject({
                    id: field.objectId,
                    options: { showContent: true }
                });
                
                const fields = (poolData.data?.content as { fields: any })?.fields?.value?.fields;
                if (!fields || poolData.data?.content?.dataType !== 'moveObject') return null;

                return {
                    pool_id: fields.pool_id,
                    pool_key: fields.pool_key,
                    coin_type_a: fields.coin_type_a?.fields?.name,
                    coin_type_b: fields.coin_type_b?.fields?.name,
                    fee_type: fields.fee_type?.fields?.name,
                    fee: fields.fee,
                    tick_spacing: fields.tick_spacing
                };
            });

            // Wait for all pool data to be fetched
            const poolsArray = (await Promise.all(poolPromises)).filter(pool => pool !== null);

            console.log("Processed pools:", JSON.stringify(poolsArray, null, 2));

            // Emit individual events for each pool
            poolsArray.forEach(pool => {
                if (!pool) return;
                
                ctx.eventLogger.emit("turbos_pool_config", {
                    id: self.data_decoded.id.id,
                    fee_map: JSON.stringify(self.data_decoded.fee_map),
                    fee_protocol: self.data_decoded.fee_protocol,
                    pool_id: pool.pool_id,
                    pool_key: pool.pool_key,
                    coin_type_a: pool.coin_type_a,
                    coin_type_b: pool.coin_type_b,
                    fee: pool.fee,
                    tick_spacing: pool.tick_spacing,
                    // Keep the full details as JSON if needed
                    pools_details: JSON.stringify(poolsArray)
                });
            });
        } catch (error) {
            console.error("Error fetching pool contents:", error);
        }
    })

        
    // // Turbos Pool state updates
    SuiObjectTypeProcessor.bind({
        objectType: turbos_pool.Pool.type(),
        network: ChainId.SUI_MAINNET
      })
      .onTimeInterval(async (self, _, ctx) => {
          ctx.eventLogger.emit("turbos_pool_states", {
            id: self.data_decoded.id,
            coin_a: self.data_decoded.coin_a,
            coin_b: self.data_decoded.coin_b,
            protocol_fees_a: self.data_decoded.protocol_fees_a,
            protocol_fees_b: self.data_decoded.protocol_fees_b,
            sqrt_price: self.data_decoded.sqrt_price,
            tick_current_index: self.data_decoded.tick_current_index,
            tick_spacing: self.data_decoded.tick_spacing,
            max_liquidity_per_tick: self.data_decoded.max_liquidity_per_tick,
            fee: self.data_decoded.fee,
            fee_protocol: self.data_decoded.fee_protocol,
            unlocked: self.data_decoded.unlocked,
            fee_growth_global_a: self.data_decoded.fee_growth_global_a,
            fee_growth_global_b: self.data_decoded.fee_growth_global_b,
            liquidity: self.data_decoded.liquidity,
            tick_map: self.data_decoded.tick_map,
            deploy_time_ms: self.data_decoded.deploy_time_ms,
            reward_infos: JSON.stringify(self.data_decoded.reward_infos),
            reward_last_updated_time_ms: self.data_decoded.reward_last_updated_time_ms,
          })
      })



      
    // // deepbook v3
    // WORKING
    // pool.bind()
    // .onEventPoolCreated((event, ctx) => {
    //     console.log("[Deepbook V3] PoolCreated event triggered:", event);

    //     ctx.eventLogger.emit("deepbook_pool_created", {
    //         pool_id: event.data_decoded.pool_id,
    //         taker_fee: event.data_decoded.taker_fee,
    //         maker_fee: event.data_decoded.maker_fee,
    //         tick_size: event.data_decoded.tick_size,
    //         lot_size: event.data_decoded.lot_size,
    //         min_size: event.data_decoded.min_size,
    //         whitelisted_pool: event.data_decoded.whitelisted_pool,
    //         treasury_address: event.data_decoded.treasury_address,
    //     })
    // })
    
    // NOT WORKING
    // registry.bind()
    // .onEventPoolKey((event, ctx) => {
    //     console.log("[Deepbook V3] PoolKey event triggered:", event);

    //     ctx.eventLogger.emit("deepbook_pool_key", {
    //         base: event.data_decoded.base,
    //         quote: event.data_decoded.quote,
    //     })
    // })
}

