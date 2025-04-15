from rest_framework import serializers
from .models import Task
from datetime import datetime

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'due_date', 'completed']
    
    def validate_due_date(self, value):
        """
        Validate the due_date field.
        """
        try:
            # Just ensure the date is valid - DRF will convert from string to date
            return value
        except Exception as e:
            raise serializers.ValidationError(f"Invalid date format: {str(e)}")
    
    def to_internal_value(self, data):
        """
        Print received data for debugging
        """
        print(f"Received data: {data}")
        return super().to_internal_value(data) 