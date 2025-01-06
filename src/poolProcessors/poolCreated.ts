import { SuiObjectTypeProcessor } from "@sentio/sdk/sui"
import { ChainId } from "@sentio/chain";


import { events as afv2_events} from "../types/sui/aftermath_v1.js";
import { events as afv1_events } from "../types/sui/aftermath_v1.js";
import { events as bluefin_events } from "../types/sui/bluefin_amm.js";
import { factory, config } from "../types/sui/cetus_factory.js"; 
import { pool_factory as turbos_factory, pool as turbos_pool } from "../types/sui/turbos_factory.js";
import { pool, registry } from "../types/sui/deepbook2.js";
import { swap as flowx_pool } from "../types/sui/flowx.js";
import {MoveFetchConfig } from '@sentio/protos'
import { spot_dex as kriya_pool } from "../types/sui/kriya.js";
import { _0x2 } from "@sentio/sdk/sui/builtin";
import { clob as deepbook_v2} from "../types/sui/deepbook_clob.js";
import { pool as deepbook_v3} from "../types/sui/deepbook2.js";
const fetchConfig: MoveFetchConfig = {
  resourceChanges: true,
  allEvents: true,
  inputs: true
}


export function initPoolsCreatedProcessor() {
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

        // flowx
        flowx_pool.bind()
        .onEventCreated_Pool_Event((event, ctx) => {
        console.log("[Flowx] PoolCreatedEvent triggered:", event);

        ctx.eventLogger.emit("flowx_pool_created", {
            pool_id: event.data_decoded.pool_id,
            creator: event.data_decoded.creator,
            token_x_name: event.data_decoded.token_x_name,
            token_y_name: event.data_decoded.token_y_name,
            token_x_amount_in: event.data_decoded.token_x_amount_in,
            token_y_amount_in: event.data_decoded.token_y_amount_in,
            lsp_balance: event.data_decoded.lsp_balance,    
            sender: event.sender,
            storage_cost: ctx.transaction.effects?.gasUsed.storageCost,
            gas_computation: ctx.transaction.effects?.gasUsed.computationCost,
            nonrefundable_storage_fee: ctx.transaction.effects?.gasUsed.nonRefundableStorageFee,
            storage_rebate: ctx.transaction.effects?.gasUsed.storageRebate,
            event_sequence: ctx.eventIndex
        })
        })
        .onEventAdd_Liquidity_Pool((event, ctx) => {
        console.log("[Flowx] AddLiquidityPoolEvent triggered:", event);

        ctx.eventLogger.emit("flowx_add_liquidity_pool", {
            pool_id: event.data_decoded.pool_id,
            user: event.data_decoded.user,
            token_x_name: event.data_decoded.token_x_name,
            token_y_name: event.data_decoded.token_y_name,
            token_x_amount_in: event.data_decoded.token_x_amount_in,
            token_y_amount_in: event.data_decoded.token_y_amount_in,
            lsp_balance: event.data_decoded.lsp_balance,
            fee_amount: event.data_decoded.fee_amount,
            sender: event.sender,
            storage_cost: ctx.transaction.effects?.gasUsed.storageCost,
            gas_computation: ctx.transaction.effects?.gasUsed.computationCost,
            nonrefundable_storage_fee: ctx.transaction.effects?.gasUsed.nonRefundableStorageFee,
            storage_rebate: ctx.transaction.effects?.gasUsed.storageRebate,
            event_sequence: ctx.eventIndex
        })
        }, fetchConfig)

    // bluefin
    bluefin_events.bind()
    .onEventPoolCreated((event, ctx) => {
        console.log("[Bluefin] PoolCreated event triggered:", event);
        ctx.eventLogger.emit("bluefin_pool_created", {
            id: event.data_decoded.id,
            coin_a: event.data_decoded.coin_a,
            coin_a_symbol: event.data_decoded.coin_a_symbol,
            coin_a_decimals: event.data_decoded.coin_a_decimals,
            coin_a_url: event.data_decoded.coin_a_url,
            coin_b: event.data_decoded.coin_b,
            coin_b_symbol: event.data_decoded.coin_b_symbol,
            coin_b_decimals: event.data_decoded.coin_b_decimals,
            coin_b_url: event.data_decoded.coin_b_url,
            current_sqrt_price: event.data_decoded.current_sqrt_price,
            current_tick_index: event.data_decoded.current_tick_index,
            tick_spacing: event.data_decoded.tick_spacing,
            fee_rate: event.data_decoded.fee_rate,
            protocol_fee_share: event.data_decoded.protocol_fee_share,
        })
    })

    deepbook_v2.bind()
    .onEventPoolCreated((event, ctx) => {
        console.log("[Deepbook Clob] PoolCreated event triggered:", event);
        ctx.eventLogger.emit("deepbook_clob_pool_created", {
            pool_id: event.data_decoded.pool_id,
            base_asset: event.data_decoded.base_asset,
            quote_asset: event.data_decoded.quote_asset,
            taker_fee_rate: event.data_decoded.taker_fee_rate,
            maker_rebate_rate: event.data_decoded.maker_rebate_rate,
            tick_size: event.data_decoded.tick_size,
            lot_size: event.data_decoded.lot_size
        })
    })

    deepbook_v3.bind()
    .onEventPoolCreated((event, ctx) => {
        console.log("[Deepbook V3] PoolCreated event triggered:", event);
        
        // Extract coin types from type arguments
        const [baseType, quoteType] = event.type_arguments;
        
        ctx.eventLogger.emit("deepbook_v3_pool_created", {
            pool_id: event.data_decoded.pool_id,
            taker_fee: event.data_decoded.taker_fee,
            maker_fee: event.data_decoded.maker_fee,
            tick_size: event.data_decoded.tick_size,
            lot_size: event.data_decoded.lot_size,
            min_size: event.data_decoded.min_size,
            whitelisted_pool: event.data_decoded.whitelisted_pool,
            treasury_address: event.data_decoded.treasury_address,
            base_type: baseType,
            quote_type: quoteType
        })
    })


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

      // kriya pool objects
      SuiObjectTypeProcessor.bind({
        objectType: kriya_pool.Pool.type(),
        network: ChainId.SUI_MAINNET
      })
      .onTimeInterval(async (self, _, ctx) => {
          try {
              console.log("[Kriya Pool] Processing pool with ID:", self.data_decoded.id.id);
              
              // Extract coin types from the object type
              const objectType = self.type;
              console.log("[Kriya Pool] Full object type:", objectType);
              
              // Parse coin types from the object type string
              // Example: "0xa0...::spot_dex::Pool<0x549...::cert::CERT, 0x2::sui::SUI>"
              const typeMatch = objectType.match(/Pool<(.+?), (.+?)>/);
              let coinTypeA = 'unknown';
              let coinTypeB = 'unknown';
              
              if (typeMatch && typeMatch.length >= 3) {
                  coinTypeA = typeMatch[1];
                  coinTypeB = typeMatch[2];
                  console.log("[Kriya Pool] Extracted coin types:", { coinTypeA, coinTypeB });
              } else {
                  console.log("[Kriya Pool] Failed to extract coin types from:", objectType);
              }

              ctx.eventLogger.emit("kriya_pool_state", {
                  pool_id: self.data_decoded.id.id,
                  coin_type_a: coinTypeA,
                  coin_type_b: coinTypeB,
                  token_x_balance: self.data_decoded.token_x,
                  token_y_balance: self.data_decoded.token_y,
                  lsp_supply: self.data_decoded.lsp_supply.value,
                  lsp_locked: self.data_decoded.lsp_locked,
                  lp_fee_percent: self.data_decoded.lp_fee_percent,
                  protocol_fee_percent: self.data_decoded.protocol_fee_percent,
                  protocol_fee_x: self.data_decoded.protocol_fee_x,
                  protocol_fee_y: self.data_decoded.protocol_fee_y,
                  is_stable: self.data_decoded.is_stable,
                  scale_x: self.data_decoded.scaleX,
                  scale_y: self.data_decoded.scaleY,
                  is_swap_enabled: self.data_decoded.is_swap_enabled,
                  is_deposit_enabled: self.data_decoded.is_deposit_enabled,
                  is_withdraw_enabled: self.data_decoded.is_withdraw_enabled
              });

          } catch (error) {
              console.error("[Kriya Pool] Error processing pool:", error);
          }
      })
}

