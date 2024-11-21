from django.shortcuts import render
from django.utils.timezone import make_aware,is_aware,get_current_timezone
from .models import AzApiSettlement,GetFlatFileAllOrdersDataByOrderDateGeneral
from datetime import datetime, timedelta
import plotly.express as px
from django.core.serializers.json import DjangoJSONEncoder
import json
from django.db.models import Max, Subquery, OuterRef, F
def az_settlement(request):
    selected_date=None
    if request.method == "POST":
        selected_date = request.POST.get('selected_date')
        print(selected_date)

    """
    View to list all settlements, with optional filtering and pagination.
    """

    if selected_date:
        try:
            # Split the date range into start and end dates
            start_date_str, end_date_str = selected_date.split(' - ')
            start_date = datetime.strptime(start_date_str.strip(), '%b %d, %Y')
            end_date = datetime.strptime(end_date_str.strip(), '%b %d, %Y')

            # Convert naive datetimes to timezone-aware datetimes
            current_tz = get_current_timezone()
            start_date = make_aware(start_date, current_tz)
            end_date = make_aware(end_date, current_tz)

        except ValueError as e:
            print("Error parsing date range. Defaulting to last 30 days.")
            start_date = make_aware(datetime.now() - timedelta(days=30), get_current_timezone())
            end_date = make_aware(datetime.now(), get_current_timezone())
    else:
        # Default to the last 30 days
        start_date = make_aware(datetime.now() - timedelta(days=30), get_current_timezone())
        end_date = make_aware(datetime.now(), get_current_timezone())

    print(f"Start Date: {start_date}, End Date: {end_date}")

    # Get filters for ASIN and account name
    search_asin = request.GET.get('asin', 'B0D2B6T93X').strip()
    search_account = request.GET.get('account_name', 'Sekhani Industries').strip()

    # Filter base querysets
    base_queryset = AzApiSettlement.objects.filter(
        isamazonfulfilled=True,
        updated_date__range=(start_date, end_date)
    )
    base_queryset2 = AzApiSettlement.objects.filter(
        isamazonfulfilled=False,
        updated_date__range=(start_date, end_date)
    )


    # Get filters for ASIN and account name
    search_asin = request.GET.get('asin', 'B0D2B6T93X').strip()
    search_account = request.GET.get('account_name', 'Sekhani Industries').strip()

    # Filter base querysets
    base_queryset = AzApiSettlement.objects.filter(
        isamazonfulfilled=True,
        updated_date__range=(start_date, end_date)
    )
    base_queryset2 = AzApiSettlement.objects.filter(
        isamazonfulfilled=False,
        updated_date__range=(start_date, end_date)
    )

    if search_asin:
        base_queryset = base_queryset.filter(asin__icontains=search_asin)
        base_queryset2 = base_queryset2.filter(asin__icontains=search_asin)

    if search_account:
        base_queryset = base_queryset.filter(account_name__icontains=search_account)
        base_queryset2 = base_queryset2.filter(account_name__icontains=search_account)

    # Get the latest settlement for Amazon-fulfilled
    settlements = base_queryset.filter(
        updated_date=Subquery(
            base_queryset.filter(updated_date=OuterRef('updated_date'))
            .order_by('-updated_date', '-id')
            .values('updated_date')[:1]
        )
    ).distinct('updated_date')

    # Get the latest settlement for self-fulfilled
    settlements2 = base_queryset2.filter(
        updated_date=Subquery(
            base_queryset2.filter(updated_date=OuterRef('updated_date'))
            .order_by('-updated_date', '-id')
            .values('updated_date')[:1]
        )
    ).distinct('updated_date')

    # Prepare data for rendering or charting
    data = {
        "labels": [settlement.updated_date.strftime('%m-%d-%Y') for settlement in settlements],
        "amazon_fulfilled": [float(settlement.final_settlement) for settlement in settlements],
        "self_fulfilled": [float(settlement.final_settlement) for settlement in settlements2],
        "input_price": [float(settlement.input_price) for settlement in settlements],
        "date_range": selected_date,
        "start_date":start_date.strftime('%Y-%m-%d'),
        "end_date":end_date.strftime('%Y-%m-%d'),
    }

    return render(request, 'analytics.html', {
        "chart_data": json.dumps(data, cls=DjangoJSONEncoder),
        "start_date": start_date.strftime('%d-%m-%Y'),
        "end_date": end_date.strftime('%d-%m-%Y')
    })