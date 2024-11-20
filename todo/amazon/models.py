from django.db import models

# Create your models here.
class AzApiSettlement(models.Model):
    id = models.UUIDField(primary_key=True)
    asin = models.CharField(db_column='Asin', max_length=255, blank=True, null=True)
    isamazonfulfilled = models.BooleanField(db_column='IsAmazonFulfilled', blank=True, null=True)
    input_price = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    totalfeesestimate = models.DecimalField(db_column='TotalFeesEstimate', max_digits=20, decimal_places=2, blank=True, null=True)
    referralfee = models.DecimalField(db_column='ReferralFee', max_digits=20, decimal_places=2, blank=True, null=True)
    referralfee_tax = models.DecimalField(db_column='ReferralFee_tax', max_digits=20, decimal_places=2, blank=True, null=True)
    variableclosingfee = models.DecimalField(db_column='VariableClosingFee', max_digits=20, decimal_places=2, blank=True, null=True)
    variableclosingfee_tax = models.DecimalField(db_column='VariableClosingFee_tax', max_digits=20, decimal_places=2, blank=True, null=True)
    closing_fee = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    closing_fee_tax = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    fullfillment_cost = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    fullfillment_cost_tax = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    fbaweighthandling = models.DecimalField(db_column='FBAWeightHandling', max_digits=20, decimal_places=2, blank=True, null=True)
    fbaweighthandling_tax = models.DecimalField(db_column='FBAWeightHandling_tax', max_digits=20, decimal_places=2, blank=True, null=True)
    fbapickandpack = models.DecimalField(db_column='FBAPickAndPack', max_digits=20, decimal_places=2, blank=True, null=True)
    fbapickandpack_tax = models.DecimalField(db_column='FBAPickAndPack_tax', max_digits=20, decimal_places=2, blank=True, null=True)
    final_settlement = models.DecimalField(db_column='final settlement', max_digits=20, decimal_places=2, blank=True, null=True)
    total_tax = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    last_updated_date = models.CharField(blank=True, null=True)
    account_name = models.CharField(blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'az_api_settlement'
        indexes = [
            models.Index(fields=['asin', 'account_name'], name='asin_account_idx'),
        ]

    def __str__(self):
        return f"{self.asin} - {self.id}"

class GetFlatFileAllOrdersDataByOrderDateGeneral(models.Model):
    id = models.UUIDField(primary_key=True)
    amazon_order_id = models.CharField(blank=True, null=True)
    merchant_order_id = models.CharField(blank=True, null=True)
    purchase_date = models.DateTimeField(blank=True, null=True)
    last_updated_date = models.DateTimeField(blank=True, null=True)
    order_status = models.CharField(blank=True, null=True)
    fulfillment_channel = models.CharField(blank=True, null=True)
    sales_channel = models.CharField(blank=True, null=True)
    order_channel = models.CharField(blank=True, null=True)
    ship_service_level = models.CharField(blank=True, null=True)
    product_name = models.CharField(blank=True, null=True)
    sku = models.CharField(blank=True, null=True)
    asin = models.CharField(blank=True, null=True)
    item_status = models.CharField(blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    currency = models.CharField(blank=True, null=True)
    item_price = models.FloatField(blank=True, null=True)
    item_tax = models.FloatField(blank=True, null=True)
    shipping_price = models.FloatField(blank=True, null=True)
    shipping_tax = models.FloatField(blank=True, null=True)
    gift_wrap_price = models.FloatField(blank=True, null=True)
    gift_wrap_tax = models.FloatField(blank=True, null=True)
    item_promotion_discount = models.FloatField(blank=True, null=True)
    ship_promotion_discount = models.FloatField(blank=True, null=True)
    ship_city = models.CharField(blank=True, null=True)
    ship_state = models.CharField(blank=True, null=True)
    ship_postal_code = models.CharField(blank=True, null=True)
    ship_country = models.CharField(blank=True, null=True)
    promotion_ids = models.CharField(blank=True, null=True)
    is_business_order = models.BooleanField(blank=True, null=True)
    purchase_order_number = models.CharField(blank=True, null=True)
    price_designation = models.CharField(blank=True, null=True)
    fulfilled_by = models.CharField(blank=True, null=True)
    is_iba = models.BooleanField(blank=True, null=True)
    account_name = models.CharField(blank=True, null=True)
    updated_date = models.DateTimeField()

    # Relationship based on ASIN
    settlements = models.ManyToManyField(AzApiSettlement, related_name='related_orders')

    class Meta:
        managed = False
        db_table = 'get_flat_file_all_orders_data_by_order_date_general'

    def __str__(self):
        return f"{self.amazon_order_id} - {self.sku}"
