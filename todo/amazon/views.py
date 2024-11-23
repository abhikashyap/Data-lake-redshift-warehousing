from django.shortcuts import render
from django.utils.timezone import make_aware, get_current_timezone
from datetime import datetime, timedelta
import json
from django.core.serializers.json import DjangoJSONEncoder
from .models import AzApiSettlement, GetFlatFileAllOrdersDataByOrderDateGeneral
from django.http import HttpResponseBadRequest
from django.shortcuts import redirect
from django.db.models.functions import TruncDate
from django.db.models import Sum,F,Avg,Count,Q,IntegerField
from django.db.models.functions import Cast


def az_settlement(request):
    # Ensure it's a GET request
    if request.method != "GET":
        return render(request, 'error.html', {"message": "Only GET requests are allowed."})

    # Retrieve parameters
    selected_date = request.GET.get('selected_date', '').strip()
    search_query = request.GET.get('search_query', '').strip()

    # Parse date range or set defaults
    try:
        if selected_date:
            start_date_str, end_date_str = selected_date.split(' - ')
            start_date = make_aware(datetime.strptime(start_date_str.strip(), '%b %d, %Y'), get_current_timezone())
            end_date = make_aware(datetime.strptime(end_date_str.strip(), '%b %d, %Y'), get_current_timezone())
        else:
            print('Selected date is missing. Using last 30 days.')
            start_date = make_aware(datetime.now() - timedelta(days=30), get_current_timezone())
            end_date = make_aware(datetime.now(), get_current_timezone())
    except ValueError:
        return render(request, 'error.html', {"message": "Invalid date format provided."})


    search_account = request.GET.get('account_name', 'Sekhani Industries').strip()

    # Querysets for settlements
    base_queryset = AzApiSettlement.objects.filter(
        updated_date__range=(start_date, end_date)
    )

    # sales
    sales_queryset = GetFlatFileAllOrdersDataByOrderDateGeneral.objects.filter(
        purchase_date__range=(start_date, end_date)
    )


    
    amazon_fulfilled = base_queryset.filter(isamazonfulfilled=True)
    self_fulfilled = base_queryset.filter(isamazonfulfilled=False)



    if search_account:
        amazon_fulfilled = amazon_fulfilled.filter(account_name__icontains=search_account)
        self_fulfilled = self_fulfilled.filter(account_name__icontains=search_account)
        

    if search_query != '':
        amazon_fulfilled = amazon_fulfilled.filter(asin__icontains=search_query)
        self_fulfilled = self_fulfilled.filter(asin__icontains=search_query)
        sales_queryset = sales_queryset.filter(asin__icontains=search_query)
        
        sales_data = (
            sales_queryset
            .filter(quantity__gt=0)  # Exclude rows with quantity = 0
            .annotate(purchase_date_only=TruncDate('purchase_date'))  # Truncate purchase_date to date
            .annotate(per_unit_price=F('item_price') / F('quantity'))  # Calculate per-unit price
            .values('purchase_date_only')  # Group by date
            .annotate(
                total_revenue=Sum('item_price'),  # Total revenue
                total_quantity=Sum('quantity'),  # Total quantity
                avg_per_unit_price=Avg('per_unit_price'),  # Average per-unit price
                daily_avg_item_price=Avg('item_price'),  # Daily average item price
                total_orders=Count('id')  # Count of valid orders
            )
            .order_by('purchase_date_only')  # Order by date
        )

        total_sales_data = (
            sales_queryset.filter(quantity__gt=0)  # Exclude rows with zero quantity
            .aggregate(
                GMV=Cast(Sum('item_price'), output_field=IntegerField()),  # Sum total quantity
                TotalQuantity=Sum('quantity'), 
                TotalOrder=Count('id'),  # Count total orders
                FbaOrder=Count('id', filter=Q(fulfilled_by='FBA')),  # Count FBA orders
                NonFbaOrder=Count('id', filter=~Q(fulfilled_by='FBA')),
                B2cOrder=Count('id', filter=Q(is_business_order=False)),  # Count FBA orders
                B2bOrder=Count('id', filter=Q(is_business_order=True)),  # Count Non-FBA orders
            )
        )

        # Get top 3 `ship_state` orders
        top_ship_states = (
            sales_queryset.filter(quantity__gt=0)  # Exclude rows with zero quantity
            .values('ship_state')  # Group by ship_state
            .annotate(total_orders=Count('id'))  # Count total orders for each ship_state
            .order_by('-total_orders')[:5]  # Get top 3 states by total orders
        )


        # Get latest settlements
        latest_amazon = amazon_fulfilled.order_by('-updated_date', '-id').first()
        latest_self = self_fulfilled.order_by('-updated_date', '-id').first()

        # Aggregate data for charts and summary
        settlements_amazon = amazon_fulfilled.distinct('updated_date').order_by('updated_date')
        settlements_self = self_fulfilled.distinct('updated_date').order_by('updated_date')

        chart_data = {
            "labels": [settlement.updated_date.strftime('%m-%d-%Y') for settlement in settlements_amazon],
            "amazon_fulfilled": [float(settlement.final_settlement) for settlement in settlements_amazon],
            "self_fulfilled": [float(settlement.final_settlement) for settlement in settlements_self],
            "input_price": [float(settlement.input_price) for settlement in settlements_amazon],
            "date_range": selected_date,
            "start_date": start_date.strftime('%Y-%m-%d'),
            "end_date": end_date.strftime('%Y-%m-%d'),
        }
        sales_chart = {
            "labels": [entry['purchase_date_only'].strftime('%m-%d-%Y') for entry in sales_data],
            "quantities": [entry['total_quantity'] for entry in sales_data],
            "Gmv": [int(entry['total_revenue']) for entry in sales_data],
            "Price": [int(entry['daily_avg_item_price']) for entry in sales_data],
        }

        latest_data = {
            "InputPrice": int(latest_amazon.input_price) if latest_amazon else 0,
            # "AzFinalSettlement": int(latest_amazon.final_settlement) if latest_amazon else 0,
            # "SelfFinalSettlement": int(latest_self.final_settlement) if latest_self else 0,
            "AzTotalFeesEstimate": int(latest_amazon.totalfeesestimate) if latest_amazon else 0,
            "SelfTotalFeesEstimate": int(latest_self.totalfeesestimate) if latest_self else 0,
            "AzTotalTax": int(round(latest_amazon.total_tax)) if latest_amazon else 0,
            "SelfTotalTax": int(round(latest_self.total_tax)) if latest_self else 0,
        }

        return render(request, 'analytics.html', {
            "chart_data": json.dumps(chart_data, cls=DjangoJSONEncoder),
            "sales_chart_data": json.dumps(sales_chart, cls=DjangoJSONEncoder),
            "start_date": start_date.strftime('%d-%m-%Y'),
            "end_date": end_date.strftime('%d-%m-%Y'),
            "latest_data": latest_data,
            'selected_date':selected_date,
            "search_query":search_query,
            "total_sales_data":total_sales_data,
            "top_ship_states":top_ship_states,

        })
    else:

        return render(request, 'failed.html', {
        'selected_date':selected_date,
        "search_query":search_query
        })

def az_settlement_with_asin(request, asin=''):
    """
    Wraps around the az_settlement view.
    Converts the ASIN provided in the URL to a search_query and passes it along with other parameters.
    """
    # Validate that an ASIN is provided
    if not asin:
        return HttpResponseBadRequest("ASIN must be provided in the URL.")

    # Build the query string with the ASIN as search_query
    query_params = request.GET.copy()  # Copy existing query params
    query_params['search_query'] = asin  # Add or overwrite the search_query with the ASIN
    # Redirect to the az_settlement view with updated parameters
    return redirect(f"{request.path.split(asin)[0]}?{query_params.urlencode()}")