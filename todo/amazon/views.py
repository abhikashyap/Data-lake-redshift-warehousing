from django.shortcuts import render
from .models import AzApiSettlement,GetFlatFileAllOrdersDataByOrderDateGeneral
from django.core.paginator import Paginator
import plotly.express as px

def az_settlement(request):

    """
    View to list all settlements, with optional filtering and pagination.
    """
    # Get filters from query parameters
    search_asin = request.GET.get('asin', 'B0D2B6T93X').strip()  # Default to empty string
    search_account = request.GET.get('account_name', 'Sekhani Industries').strip()  # Default to empty string

    # Filter settlements based on the query parameters
    settlements = AzApiSettlement.objects.all()
    if search_asin:
        settlements = settlements.filter(asin__icontains=search_asin)
    if search_account:
        settlements = settlements.filter(account_name__icontains=search_account)

    data = [
        {
            "updated_date": settlement.updated_date,
            "final_settlement": settlement.final_settlement,
            "input_price": settlement.input_price,  # Include input_price for hover
            "isamazonfulfilled": "Fulfilled by Amazon" if settlement.isamazonfulfilled else "Not Fulfilled by Amazon",
        }
        for settlement in settlements
    ]

    # Create a scatter plot with hover data
    fig = px.scatter(
        data,
        x="updated_date",
        y="final_settlement",
        color="isamazonfulfilled",  # Group points by `isamazonfulfilled`
        hover_data=["input_price"],  # Add `input_price` as hover data
        title="Settlements - Fulfilled vs Not Fulfilled by Amazon (Scatter Plot with Input Price)",
        labels={
            "updated_date": "Updated Date",
            "final_settlement": "Final Settlement",
            "isamazonfulfilled": "Fulfillment Status",
        },
    )
    latest_info_true = settlements.filter(isamazonfulfilled=True).order_by('-updated_date').first()
    latest_info_false = settlements.filter(isamazonfulfilled=False).order_by('-updated_date').first()

    # Pass the data to the template
    context = {
        "chart": fig.to_html(full_html=False),
        "latest_info_true": latest_info_true,
        "latest_info_false": latest_info_false,
    }

    return render(request, 'analytics.html', context)

