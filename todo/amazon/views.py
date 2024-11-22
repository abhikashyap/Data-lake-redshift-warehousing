from django.shortcuts import render,redirect
from django.utils.timezone import make_aware,is_aware,get_current_timezone
from .models import AzApiSettlement,GetFlatFileAllOrdersDataByOrderDateGeneral
from datetime import datetime, timedelta
import plotly.express as px
from django.core.serializers.json import DjangoJSONEncoder
import json
from django.db.models import Max, Subquery, OuterRef, F



def az_settlement(request):
    selected_date = request.POST.get('selected_date') if request.method == "POST" else None

    try:
        if selected_date:
            start_date_str, end_date_str = selected_date.split(' - ')
            start_date = make_aware(datetime.strptime(start_date_str.strip(), '%b %d, %Y'), get_current_timezone())
            end_date = make_aware(datetime.strptime(end_date_str.strip(), '%b %d, %Y'), get_current_timezone())
        else:
            raise ValueError
    except ValueError:
        print('.................error in selecting date...............')
        start_date = make_aware(datetime.now() - timedelta(days=30), get_current_timezone())
        end_date = make_aware(datetime.now(), get_current_timezone())

    # Filters
    search_asin = request.GET.get('asin', 'B0D2B6T93X').strip()
    search_account = request.GET.get('account_name', 'Sekhani Industries').strip()


    # Querysets for Amazon-fulfilled and self-fulfilled settlements
    base_queryset = AzApiSettlement.objects.filter(
        updated_date__range=(start_date, end_date)
    )
    amazon_fulfilled = base_queryset.filter(isamazonfulfilled=True)
    self_fulfilled = base_queryset.filter(isamazonfulfilled=False)

    if search_asin:
        amazon_fulfilled = amazon_fulfilled.filter(asin__icontains=search_asin)
        self_fulfilled = self_fulfilled.filter(asin__icontains=search_asin)

    if search_account:
        amazon_fulfilled = amazon_fulfilled.filter(account_name__icontains=search_account)
        self_fulfilled = self_fulfilled.filter(account_name__icontains=search_account)

    # Get latest settlements for both categories
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

    latest_data = {
        "InputPrice": int(latest_amazon.input_price) if latest_amazon else 0,
        "AzFinalSettlement": int(latest_amazon.final_settlement) if latest_amazon else 0,
        "SelfFinalSettlement": int(latest_self.final_settlement) if latest_self else 0,
        "AzTotalFeesEstimate": int(latest_amazon.totalfeesestimate) if latest_amazon else 0,
        "SelfTotalFeesEstimate": int(latest_self.totalfeesestimate) if latest_self else 0,
        "AzTotalTax": int(round(latest_amazon.total_tax)) if latest_amazon else 0,
        "SelfTotalTax": int(round(latest_self.total_tax)) if latest_self else 0,
    }

    return render(request, 'analytics.html', {
        "chart_data": json.dumps(chart_data, cls=DjangoJSONEncoder),
        "start_date": start_date.strftime('%d-%m-%Y'),
        "end_date": end_date.strftime('%d-%m-%Y'),
        "latest_data": latest_data,
    })
