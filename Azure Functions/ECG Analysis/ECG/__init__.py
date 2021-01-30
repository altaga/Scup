import logging

import azure.functions as func
from heartpy import remove_baseline_wander,filter_signal,process,scale_data
import numpy as np
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    data = req.params.get('data')
    if not data:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            data = req_body.get('data')
            
    if data:
        try:
            ecg = data.split(",")
            sample_rate = 252

            ecg = np.array([ecg])
            ecg = ecg.astype(np.float64)
            ecg = ecg[0]

            filtered1= remove_baseline_wander(ecg, sample_rate)

            filtered = filter_signal(filtered1, cutoff = [2, 32], sample_rate = sample_rate , order = 5, filtertype='bandpass')

            wd, m = process(scale_data(filtered), sample_rate)

            d = []

            for measure in m.keys():
                d.append(measure)
                d.append(m[measure])
                print('%s: %f' %(measure, m[measure]))
        
            return func.HttpResponse(str(d))
        except:
            return func.HttpResponse(str("API Error!"))

    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
