  public updateChannelDataAddAgents = (payload: any): Promise<any> => {
    // const current_time = payload.current_time || Utils.Time.utcTimeStamp();
    // const previous_time = payload.previous_time || (current_time - (3 * 60 * 1000)); //new Date(moment().subtract(5, 'minutes').toString()).getTime();
    // this.logger.debug('current_time=', JSON.stringify(current_time));
    // this.logger.debug('previous_time=', JSON.stringify(previous_time));updateChannelIndexDoc
    // let searchChannel = {};
      let params = {
        TableName: 'channel',
        Limit : 3500
      };
    if (payload.LastEvaluatedKey) {
      params = _.assign(params, {
        ExclusiveStartKey: payload.LastEvaluatedKey,
      });
    }
      return this.registry.api.db.dynamodb.scan(params).then((channelData: any) => {
        if (channelData && channelData.Items.length > 0) {
          channelData.Items.map((item: any) => {
            let updatePayload: any = {
              channel_id: item.channel_id,
              agents: item.agents,
            }
            this.registry.api.ES.elasticsearch
              .updateChannelIndexDoc(updatePayload).then((result: any) => {
                console.log('Updating data', result);
              })
              .catch((error: any) => {
                console.log('item.channel_id',item.channel_id,'update channel error', JSON.stringify(error))
              })
          })
          const channelsPromise = channelData.Items;
        console.log(channelsPromise)
        return Promise.all(channelsPromise).then((SPromise: any) => {
                      return {
                        data: channelData,
                        code: 200,
                        error: null
                      };
                    })
                  } else {
                    return {
                      data: null,
                      code: 200,
                      error: 'data not found'
                    };
                  }
      });
    // })
    // const searchChannel = {
    //   body: {
    //     query: {
    //       "match_all": {}
    //     }
    //   },
    //   index: 'channels',
    //   size: 3,
    // };
  // return this.registry.api.ES.elasticsearch
  //   .searchEs(searchChannel)
  //   .then((channelData: any) => {
  //     return channelData;
  //   });
    // this.logger.debug("searchParams ===", JSON.stringify(searchChannel));
    //   return this.registry.api.ES.elasticsearch
    //       .searchEs(searchChannel)
    //       .then((channelData: any) => {
    //         // this.logger.debug('threadsData ===', JSON.stringify(threadsData));
    //         if (channelData && channelData.hits.total > 0) {
    //           const channelsPromise: any = channelData.hits.hits;
    //           channelsPromise.map((item:any) => {
    //             console.log(item)
    //           })
    //        console.log('channelData', channelData.hits.hits)
    //           return Promise.all(channelsPromise).then((SPromise: any) => {
    //             return {
    //               data: channelsPromise,
    //               code: 200,
    //               error: null
    //             };
    //           })
    //         } else {
    //           return {
    //             data: null,
    //             code: 200,
    //             error: 'data not found'
    //           };
    //         }
    //       });
  }
