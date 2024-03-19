
# Request for data collection review form

1) What questions will you answer with this data?

* Aggregation of Ad Impressions, Clicks, and Conversions reported through private attribution (DAP)
* Design Document: https://docs.google.com/document/d/1lUIMtKuTGtJuuZNXwZ9BOdvWjryfn1c_d8zDbg28TY0
* This request is to include the functionality provided by the web extension, in the design document, to Firefox.

2) Why does Mozilla need to answer these questions?  Are there benefits for users? Do we need this information to address product or business requirements? Some example responses:

* To improve user advertising attribution privacy.
* To improve advertiser attribution reporting capabilities.
* We need this information to evaluate utilizing DAP infrastructure to provide private advertising attribution in Firefox.

3) What alternative methods did you consider to answer these questions? Why were they not sufficient?

* Alternative solutions explored include using OHTTP vs DAP and adding a new DOM API to Firefox, though both of these alternatives still require collecting the same data in Firefox.

4) Can current instrumentation answer these questions?

* We currently do not collect any data to provide attribution in advertising reports due to the privacy implications of collecting this information.
* The reason for this request is to evaluate a privacy preserving attribution method by collecting aggregated client attribution data through the Distributed Aggregated Protocol (DAP).

5) List all proposed measurements and indicate the category of data collection for each measurement, using the [Firefox data collection categories](https://wiki.mozilla.org/Data_Collection) found on the Mozilla wiki.

* Note: Measurements will only be captured by websites that trigger the custom event.
This will initially be from Mozilla Ad Suppliers (i.e. MDN, Fakespot, Pocket) and approved Advertisers.

<table>
  <tr>
    <td>Measurement Description</td>
    <td>Data Collection Category</td>
    <td>Tracking Bug #</td>
  </tr>
  <tr>
    <td>Task ID/Index/Size. These will come from the ad server and be used to identify the DAP task and data location for an ad in the task.</td>
    <td>Category 2</td>
    <td>TBD</td>
  </tr>
  <tr>
    <td>Conversion Key. This will come from the ad server and be used by advertisers to track conversions.</td>
    <td>Category 2</td>
    <td>TBD</td>
  </tr>
  <tr>
    <td>Ad View/Impression Totals</td>
    <td>Category 2</td>
    <td>TBD</td>
  </tr>
  <tr>
    <td>Ad Click Totals</td>
    <td>Category 2</td>
    <td>TBD</td>
  </tr>
  <tr>
    <td>Ad Conversion Totals. Conversions occur when an advertiser triggers the custom event for a conversion and there has been a recently related view/click.</td>
    <td>Category 2</td>
    <td>TBD</td>
  </tr>
  <tr>
    <td>Last Source Timestamp. This will keep track of the last timestamp an ad view/click occurred.</td>
    <td>Category 2</td>
    <td>TBD</td>
  </tr>
</table>

6) Please provide a link to the documentation for this data collection which describes the ultimate data set in a public, complete, and accurate way.
* It currently is not included, but the detailed documentation is currently in the design document and can be delivered in a public manner that is required to be included in Firefox when a decision has been made on its inclusion.
* Data Privacy Documentation: https://docs.google.com/document/d/1lUIMtKuTGtJuuZNXwZ9BOdvWjryfn1c_d8zDbg28TY0/edit#heading=h.sfto3hc5eurd

7) How long will this data be collected?  Choose one of the following:

* The Ads Engineering team wants to collect this information permanently, but the client data will have a retention period of 30 days after the last source event.
* Potentially the data collection could be scoped to a shorter period and extended if the design is proven to be a viable long term solution.

8) What populations will you measure?

* All channels, countries, and locales. No filters.

9) If this data collection is default on, what is the opt-out mechanism for users?

The collection is default on, and the opt-out mechanism is considered to be use of private browsing. This may need further discussion to align the Ads Organization with the Firefox/Data Collection Organization.

10) Please provide a general description of how you will analyze this data.

This data will be used to aggregate and send through DAP in order to anonymize the data. The collected ad impression, click, and conversion aggregations can then be used, along with task id/index, to associate the interacted ad, and provide advertisers with privately collected conversion/attribution reporting.

11) Where do you intend to share the results of your analysis?

* The raw client data collected in Firefox will not be directly shared. The only data that will be shared are the anonymized aggregated results from DAP.
* The aggregated results will be shared Internally within Mozilla and with potential Ad Suppliers and Advertisers.

12) Is there a third-party tool (i.e. not Glean or Telemetry) that you are proposing to use for this data collection?

* No.